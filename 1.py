import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import xgboost as xgb


def wmae(y_true, y_pred, weight):
    """Взвешенная средняя абсолютная ошибка"""
    return np.sum(np.abs(y_true - y_pred) * weight) / np.sum(weight)


def quick_preprocess_raw(df):
    """Быстрая предобработка сырых данных"""
    df_clean = df.copy()
    for col in df_clean.columns:
        if df_clean[col].dtype == 'object':
            try:
                temp = df_clean[col].astype(str).str.replace(',', '.', regex=False)
                df_clean[col] = pd.to_numeric(temp, errors='ignore')
            except Exception:
                df_clean[col] = df_clean[col].fillna('Unknown')

        if df_clean[col].isna().any():
            if df_clean[col].dtype == 'object':
                df_clean[col] = df_clean[col].fillna('Unknown')
            else:
                df_clean[col] = df_clean[col].fillna(df_clean[col].median())
    return df_clean


def evaluate_xgb_gpu(train_data, test_size=0.2, weight_col='w'):
    """Оценка XGBoost на GPU с учетом весов"""
    X = train_data.drop(columns=['target'])
    y = train_data['target']

    # Извлекаем веса если есть
    if weight_col in X.columns:
        weights = X[weight_col].values
        X = X.drop(columns=[weight_col])
    else:
        weights = np.ones(len(X))

    # Только числовые признаки
    numeric_cols = X.select_dtypes(include=[np.number]).columns
    X = X[numeric_cols]

    X_train, X_val, y_train, y_val, w_train, w_val = train_test_split(
        X, y, weights,
        test_size=test_size,
        random_state=42
    )

    # Нормализуем веса для корректной работы XGBoost
    w_train_normalized = w_train / w_train.mean()
    w_val_normalized = w_val / w_val.mean()

    # ВАЖНО: передаём weight при создании DMatrix
    dtrain = xgb.DMatrix(X_train.values, label=y_train.values, weight=w_train_normalized)
    dval = xgb.DMatrix(X_val.values, label=y_val.values, weight=w_val_normalized)

    params = {
        'tree_method': 'hist',  # или 'gpu_hist' если есть GPU
        'max_depth': 6,
        'learning_rate': 0.1,
        'objective': 'reg:squarederror',
        'eval_metric': 'mae'
    }

    evals = [(dtrain, 'train'), (dval, 'val')]
    model = xgb.train(
        params=params,
        dtrain=dtrain,
        num_boost_round=100,
        evals=evals,
        verbose_eval=False
    )

    y_pred = model.predict(dval)

    mae = mean_absolute_error(y_val, y_pred)
    # Используем исходные веса для вычисления WMAE
    wmae_score = wmae(y_val.values, y_pred, w_val)

    return mae, wmae_score, X_train.shape[1]


def evaluate_rf_on_dataset(train_data, test_size=0.2, weight_col='w'):
    """Оценка Random Forest на датасете (CPU версия)"""
    X = train_data.drop(columns=['target'])
    y = train_data['target']

    # Извлекаем веса если есть
    if weight_col in X.columns:
        weights = X[weight_col].values
        X = X.drop(columns=[weight_col])
    else:
        weights = np.ones(len(X))

    numeric_cols = X.select_dtypes(include=[np.number]).columns
    X = X[numeric_cols]

    X_train, X_val, y_train, y_val, w_train, w_val = train_test_split(
        X, y, weights,
        test_size=test_size,
        random_state=42
    )

    # Нормализуем веса для RF
    w_train_normalized = w_train / w_train.mean()

    rf = RandomForestRegressor(
        n_estimators=100,
        random_state=42,
        n_jobs=-1
    )
    # Веса для RF
    rf.fit(X_train, y_train, sample_weight=w_train_normalized)

    y_pred = rf.predict(X_val)

    mae = mean_absolute_error(y_val, y_pred)
    # Используем исходные веса для вычисления WMAE
    wmae_score = wmae(y_val.values, y_pred, w_val)

    return mae, wmae_score, X_train.shape[1]


# ===================== ОСНОВНОЕ СРАВНЕНИЕ =====================

print("🔍 СРАВНЕНИЕ МОДЕЛЕЙ НА РАЗНЫХ ДАТАСЕТАХ (С УЧЕТОМ ВЕСОВ)")
print("=" * 60)

print("1. ОЧИЩЕННЫЕ ДАННЫЕ (XGBoost):")
train_raw = pd.read_csv('data/hackathon_income_train_cleared.csv')
train_raw_clean = quick_preprocess_raw(train_raw)
mae_raw, wmae_raw, features_raw = evaluate_xgb_gpu(train_raw_clean)
print(f"   MAE: {mae_raw:.4f}, WMAE: {wmae_raw:.4f}, Признаков: {features_raw}")

print("\n3. ИМПУТИРОВАННЫЕ ДАННЫЕ (XGBoost):")
train_imputed = pd.read_csv('data/hackathon_income_train_imputed.csv')
mae_imputed, wmae_imputed, features_imputed = evaluate_xgb_gpu(train_imputed)
print(f"   MAE: {mae_imputed:.4f}, WMAE: {wmae_imputed:.4f}, Признаков: {features_imputed}")

print("\n4. ИМПУТИРОВАННЫЕ ДАННЫЕ (Random Forest):")
mae_rf, wmae_rf, features_rf = evaluate_rf_on_dataset(train_imputed)
print(f"   MAE: {mae_rf:.4f}, WMAE: {wmae_rf:.4f}, Признаков: {features_rf}")

print("\n🏆 ИТОГИ:")
results = {
    'XGBoost (очищ)': wmae_raw,
    'XGBoost (импут)': wmae_imputed,
    'RF (импут)': wmae_rf
}

best_model = min(results, key=results.get)
print(f"ЛУЧШАЯ МОДЕЛЬ: {best_model} (WMAE: {results[best_model]:.4f})")
