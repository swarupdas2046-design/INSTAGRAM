import imagekit from "imagekit";

const StorageInstance = new imagekit({
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINTS,
  publicKey: process.env.IMAGEKIT_PUBLIC_SECRET,
  privateKey: process.env.IMAGEKIT_PRIVATE_SECRET,
});

const sendFile = async (file, fileName,folderName) => {
  const option = {
    file,
    fileName,
    folder: `Instagram/${folderName}`, // folder name in imagekit
  };
  const response = await StorageInstance.upload(option);
  return response;
};

export default sendFile;
