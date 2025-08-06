import tensorflow as tf
import os

# --- 설정값 ---
DATASET_PATH = 'dataset/tree' 
IMG_SIZE = (160, 160) 
BATCH_SIZE = 4
EPOCHS = 15

# --- 1. 데이터셋 불러오기 ---
print(f"'{DATASET_PATH}' 경로에서 데이터셋을 불러옵니다...")
train_dataset, validation_dataset = tf.keras.utils.image_dataset_from_directory(
    DATASET_PATH,
    validation_split=0.2,
    subset="both",
    seed=123,
    image_size=IMG_SIZE,
    color_mode='grayscale'
)

class_names = train_dataset.class_names
print(f"클래스(정답) 이름: {class_names}")

AUTOTUNE = tf.data.AUTOTUNE
train_dataset = train_dataset.prefetch(buffer_size=AUTOTUNE)
validation_dataset = validation_dataset.prefetch(buffer_size=AUTOTUNE)


# --- 2. 데이터 뻥튀기(Augmentation) 레이어 정의 ---
data_augmentation = tf.keras.Sequential([
    tf.keras.layers.RandomRotation(0.1),
    tf.keras.layers.RandomZoom(0.1),
])


# --- 3. 모델 준비 ---
print("모델을 준비합니다...")
IMG_SHAPE = IMG_SIZE + (1,) 
base_model = tf.keras.applications.MobileNetV2(
    input_shape=IMG_SHAPE,
    include_top=False,
    weights=None
)
base_model.trainable = True


# --- 4. 최종 모델 설계 ---
print("최종 모델을 설계합니다...")
inputs = tf.keras.Input(shape=IMG_SHAPE)
x = data_augmentation(inputs)
x = tf.keras.layers.Rescaling(1./255)(x)
x = base_model(x, training=True)
x = tf.keras.layers.GlobalAveragePooling2D()(x)
x = tf.keras.layers.Dropout(0.2)(x)
outputs = tf.keras.layers.Dense(1, activation='sigmoid')(x) 

model = tf.keras.Model(inputs, outputs)


# --- 5. 모델 컴파일 ---
model.compile(optimizer='adam',
              loss='binary_crossentropy',
              metrics=['accuracy'])


# --- 6. 모델 훈련 ---
print("\n--- 모델 훈련 시작 ---")
model.fit(train_dataset,
          epochs=EPOCHS,
          validation_data=validation_dataset)


# --- 7. 훈련된 모델 저장 ---
model.save('model_tree.h5')
print(f"\n--- 훈련 완료! 'model_tree.h5' 파일로 모델이 저장되었습니다. ---")
