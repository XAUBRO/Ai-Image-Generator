// Define the API key
const API_KEY = ''

// Get the search button element and add a click event listener
const searchBtn = document.getElementById('searchBtn');
searchBtn.addEventListener('click', fetchImages);

// Get the search input element and add a keydown event listener
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keydown', (event) => {
  if(event.key === 'Enter') {
    fetchImages();
  }
})

// Fetch images based on the search input using the OpenAI API
async function fetchImages() {
  const prompt = searchInput.value;
  
  const numImages = 4;
  // Validate the number of images
  if (numImages < 1 || numImages > 10) {
    alert('Invalid number of images. Please enter a number between 1 and 10.');
    return;
  }

 // Clear the existing images from the grid
  const imageGrid = document.getElementById('imageGrid');
  imageGrid.innerHTML = '';

  showLoadingAnimation();

// Make a POST request to the OpenAI API to fetch the images
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        prompt: prompt,
        n: numImages,
        size: '512x512'
      })
    });

    const data = await response.json();

    if (response.ok) {
      // Display the fetched images
      data.data.forEach(imageUrl => {
        const generatedUrl = imageUrl.url;
        const imageCard = document.createElement('div');
        imageCard.classList.add('image-card');

        const img = document.createElement('img');
        img.src = generatedUrl;

        // Add a 'loaded' class to the image once it is loaded
        img.addEventListener('load', () => {
          img.classList.add('loaded'); 
          addDownloadButton(imageCard, generatedUrl);
        })
        // Append the img to the image-card div
        imageCard.appendChild(img);
        // Append the image-card div to the imageGrid
        imageGrid.appendChild(imageCard);
      });
    } else {
      console.error('Image fetch failed:', data.error);
    }
  } catch (error) {
    console.error('Error:', error)
  }
  hideLoadingAnimation();
}
function addDownloadButton(parentElement, imageUrl) {
    // Create a download button element
    const downloadBtn = document.createElement('button');
    downloadBtn.innerText = 'Download';
    downloadBtn.classList.add('download-button');
    downloadBtn.setAttribute('data-url', imageUrl);
  
    // Add a click event listener to the download button
    downloadBtn.addEventListener('click', () => {
      downloadImage(imageUrl);
    });
  
    // Append the download button to the parent element
    parentElement.appendChild(downloadBtn);
  }
  
  function downloadImage(imageUrl) {
    // Create an anchor element with the image URL
    const downloadLink = document.createElement('a');
    downloadLink.href = imageUrl;
    downloadLink.target = '_blank';
    downloadLink.download = 'image.jpg'; // Set a default filename for the downloaded image
  
    // Trigger a click on the anchor element to start the download
    downloadLink.click();
  }
function showLoadingAnimation() {
  const searchBtnIcon = document.getElementById('searchBtnIcon');
  searchBtnIcon.style.display = 'none';

  const loadingAnimation = document.getElementById('loadingAnimation');
  loadingAnimation.style.display = 'block';
}

function hideLoadingAnimation() {
  const searchBtnIcon = document.getElementById('searchBtnIcon');
  searchBtnIcon.style.display = 'block';

  const loadingAnimation = document.getElementById('loadingAnimation');
  loadingAnimation.style.display = 'none';
}
