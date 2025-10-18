let model;
let products = [];
const resultText = document.getElementById('result');
const predictBtn = document.getElementById('predictBtn');
const modelSelect = document.getElementById('modelSelect');
const previewImg = document.getElementById('preview');
const imageUpload = document.getElementById('imageUpload');
const productsSection = document.getElementById('productsSection');
const productsList = document.getElementById('productsList');

const classNames = [
  'Indian Bridal Makeup',
  'Bridal Makeup',
  'Glam Makeup',
  'Natural Makeup',
  'Party Makeup'
];

// Load product recommendations
fetch('products.json')
  .then(res => res.json())
  .then(data => {
    products = data;
    console.log("✅ Products loaded:", products.length);
  })
  .catch(err => console.error("❌ Error loading products.json:", err));

// Load selected AI model
async function loadModel(modelPath) {
  resultText.textContent = '⏳ Loading model... please wait';
  predictBtn.disabled = true;
  try {
    model = await tf.loadGraphModel(modelPath);
    resultText.textContent = '✅ Model loaded. Upload an image to begin.';
    predictBtn.disabled = false;
    console.log("Model loaded:", modelPath);
  } catch (error) {
    resultText.textContent = '❌ Failed to load model.';
    console.error("Model loading error:", error);
  }
}

function preprocessImage(image) {
  return tf.browser.fromPixels(image)
    .resizeNearestNeighbor([224, 224])
    .toFloat()
    .div(tf.scalar(255.0))
    .expandDims();
}

// Handle image upload
imageUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
    previewImg.style.display = 'block';
  };
  reader.readAsDataURL(file);
});

// Handle model change
modelSelect.addEventListener('change', () => {
  resultText.textContent = '';
  previewImg.src = '';
  previewImg.style.display = 'none';
  productsSection.style.display = 'none';
  loadModel(modelSelect.value);
});

// Predict makeup style
predictBtn.addEventListener('click', async () => {
  if (!model) {
    resultText.textContent = '⚠️ Model not loaded yet.';
    return;
  }
  if (!previewImg.src) {
    resultText.textContent = '⚠️ Please upload an image first.';
    return;
  }

  const inputTensor = preprocessImage(previewImg);
  const output = await model.executeAsync(inputTensor);
  const prediction = Array.isArray(output) ? output[0].dataSync() : output.dataSync();

  if (modelSelect.value === 'model/model.json') {
    const result = prediction[0] > 0.5 ? "💄 Makeup Detected" : "🙂 No Makeup Detected";
    resultText.textContent = result;
  } else {
    const maxIndex = prediction.indexOf(Math.max(...prediction));
    const predictedStyle = classNames[maxIndex] || `Unknown Style (${maxIndex})`;
    resultText.textContent = `🎨 Predicted Style: ${predictedStyle}`;

    // Ask user for skin type
    let skinType = prompt("Enter your skin type (Oily/Dry):");
    if (skinType) {
      skinType = skinType.trim();
      const recommended = products.filter(p => 
        p.style === predictedStyle && p.skinType.toLowerCase() === skinType.toLowerCase()
      );

      productsSection.style.display = 'block';
      productsList.innerHTML = '';

      if (recommended.length > 0) {
        recommended.forEach(item => {
          const li = document.createElement('li');
          li.innerHTML = `<b>${item.name}</b> (${item.brand}) - ${item.type}, Shade: ${item.shade} 
                          <a href="${item.link}" target="_blank">Buy</a>`;
          productsList.appendChild(li);
        });
      } else {
        productsList.innerHTML = `<li>⚠️ No matching products found for your skin type.</li>`;
      }
    }
  }
});

// Load default model on startup
window.addEventListener('DOMContentLoaded', () => {
  loadModel(modelSelect.value);
});
