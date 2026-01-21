import { useState, useEffect } from "react";
import { safeStorage } from "../utils/chromePolyfill";

function CustomTab() {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Load saved images and selected image from storage
    safeStorage.get(['customImages', 'selectedCustomImage'], function (result) {
      if (result.customImages) {
        setUploadedImages(result.customImages);
      }
      if (result.selectedCustomImage !== undefined) {
        setSelectedImage(result.selectedCustomImage);
      }
    });
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target.result;
      const newImages = [...uploadedImages, base64Image];
      setUploadedImages(newImages);

      // If this is the only image, automatically select it
      if (newImages.length === 1) {
        setSelectedImage(0);
        safeStorage.set({
          selectedCustomImage: 0,
          custompic: base64Image
        });
      }

      // Save to storage
      safeStorage.set({ customImages: newImages }, function () {
        console.log('Custom images saved');
      });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);

    // If only one image remains, automatically select it
    if (newImages.length === 1) {
      setSelectedImage(0);
      safeStorage.set({
        selectedCustomImage: 0,
        custompic: newImages[0]
      });
    } else if (newImages.length === 0) {
      // If no images remain, clear selection
      setSelectedImage(null);
      safeStorage.set({
        selectedCustomImage: null,
        custompic: null
      });
    } else if (index === selectedImage) {
      // If the removed image was selected, clear selection
      setSelectedImage(null);
      safeStorage.set({
        selectedCustomImage: null,
        custompic: null
      });
    }

    // Update storage
    safeStorage.set({ customImages: newImages }, function () {
      console.log('Custom images updated');
    });
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Upload your own images
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {uploadedImages.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image}
              alt={`Custom ${index + 1}`}
              className={`w-24 h-24 rounded-full border-2 border-gray-300 m-2 transition-transform duration-300 ease-in-out shadow-md ${selectedImage === index ? 'selected-waifu-img' : ''
                }`}
              onClick={() => {
                setSelectedImage(index);
                safeStorage.set({
                  selectedCustomImage: index,
                  custompic: image
                }, function () {
                  console.log('Selected custom image saved');
                });
              }}
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {uploadedImages.length === 0 && (
        <div className="text-center text-gray-500 mt-4">
          No images uploaded yet. Upload some images to get started!
        </div>
      )}
    </div>
  );
}

export default CustomTab;