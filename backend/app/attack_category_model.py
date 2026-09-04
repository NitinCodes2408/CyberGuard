import os
import pandas as pd
import joblib

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

TRAIN_FILE = os.path.join(
    BASE_DIR, "dataset", "UNSW_NB15_training-set.csv"
)

TEST_FILE = os.path.join(
    BASE_DIR, "dataset", "UNSW_NB15_testing-set.csv"
)

MODEL_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODEL_DIR, exist_ok=True)


print("Loading dataset...")

train_df = pd.read_csv(TRAIN_FILE)
test_df = pd.read_csv(TEST_FILE)

# Keep only attack records
train_df = train_df[train_df["label"] == 1].copy()
test_df = test_df[test_df["label"] == 1].copy()

print("Attack training records:", train_df.shape)
print("Attack testing records:", test_df.shape)


# Features and target
drop_columns = ["id", "label", "attack_cat"]

X_train = train_df.drop(columns=drop_columns)
y_train = train_df["attack_cat"]

X_test = test_df.drop(columns=drop_columns)
y_test = test_df["attack_cat"]


categorical_columns = ["proto", "service", "state"]

numeric_columns = [
    col for col in X_train.columns
    if col not in categorical_columns
]


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


model = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    n_jobs=-1,
    class_weight="balanced"
)


pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model)
    ]
)


print("\nTraining attack category model...")

pipeline.fit(X_train, y_train)

print("Training completed!")


print("\nTesting model...")

predictions = pipeline.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print("\n==============================")
print("ATTACK CATEGORY ACCURACY:",
      round(accuracy * 100, 2), "%")
print("==============================")

print("\nClassification Report:")
print(classification_report(y_test, predictions))


model_path = os.path.join(
    MODEL_DIR, "attack_category_model.pkl"
)

joblib.dump(pipeline, model_path)

print("\nAttack category model saved!")
print("Location:", model_path)