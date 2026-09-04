import os
import pandas as pd
import joblib

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report


# -----------------------------
# 1. File paths
# -----------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

TRAIN_FILE = os.path.join(BASE_DIR, "dataset", "UNSW_NB15_training-set.csv")
TEST_FILE = os.path.join(BASE_DIR, "dataset", "UNSW_NB15_testing-set.csv")

MODEL_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODEL_DIR, exist_ok=True)


# -----------------------------
# 2. Load dataset
# -----------------------------

print("Loading dataset...")

train_df = pd.read_csv(TRAIN_FILE)
test_df = pd.read_csv(TEST_FILE)

print("Training data:", train_df.shape)
print("Testing data:", test_df.shape)


# -----------------------------
# 3. Prepare data
# -----------------------------

# Remove unnecessary columns
drop_columns = ["id", "attack_cat"]

X_train = train_df.drop(columns=["label"] + drop_columns, errors="ignore")
y_train = train_df["label"]

X_test = test_df.drop(columns=["label"] + drop_columns, errors="ignore")
y_test = test_df["label"]


# -----------------------------
# 4. Identify categorical columns
# -----------------------------

categorical_columns = ["proto", "service", "state"]

categorical_columns = [
    col for col in categorical_columns
    if col in X_train.columns
]

numeric_columns = [
    col for col in X_train.columns
    if col not in categorical_columns
]


# -----------------------------
# 5. Preprocessing
# -----------------------------

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_columns
        ),
        (
            "numeric",
            "passthrough",
            numeric_columns
        )
    ]
)


# -----------------------------
# 6. Machine Learning Model
# -----------------------------

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    n_jobs=-1,
    class_weight="balanced"
)


# -----------------------------
# 7. Create ML Pipeline
# -----------------------------

pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model)
    ]
)


# -----------------------------
# 8. Train model
# -----------------------------

print("\nTraining AI model...")
pipeline.fit(X_train, y_train)

print("Training completed!")


# -----------------------------
# 9. Test model
# -----------------------------

print("\nTesting model...")

predictions = pipeline.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print("\n==============================")
print("MODEL ACCURACY:", round(accuracy * 100, 2), "%")
print("==============================")

print("\nClassification Report:")
print(classification_report(y_test, predictions))


# -----------------------------
# 10. Save model
# -----------------------------

model_path = os.path.join(MODEL_DIR, "cyber_threat_model.pkl")

joblib.dump(pipeline, model_path)

print("\nModel saved successfully!")
print("Location:", model_path)