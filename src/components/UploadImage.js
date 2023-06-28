// import React from "react";

// import { useState } from "react";

// import Button from "@mui/material/Button";
// import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
// import CircularProgress from "@mui/material/CircularProgress";

// import app from "./firebase-config";
// import { ref, uploadString, getDownloadURL, getStorage } from "firebase/storage";
// const storage = getStorage(app);

// const UploadImage = (props) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [changedProfilepic, setChangedProfilepic] = useState(false);
//   const [fileName, setFileName] = useState("");

//   const handleProfiePicChange = (e) => {
//     if (e.target.files[0]) {
//       const file = e.target.files[0];
//       const reader = new FileReader();
//       reader.readAsDataURL(file);

//       // reader onload event is triggered when the reader is done reading the file
//       reader.onload = (event) => {
//         const img = new Image();
//         img.src = event.target.result;
//         img.onload = () => {
//           const canvas = document.createElement("canvas");
//           const maxWidth = 270;
//           const maxHeight = 300;
//           let width = img.width;
//           let height = img.height;

//           if (width > height) {
//             if (width > maxWidth) {
//               height *= maxWidth / width;
//               width = maxWidth;
//             }
//           } else {
//             if (height > maxHeight) {
//               width *= maxHeight / height;
//               height = maxHeight;
//             }
//           }

//           canvas.width = width;
//           canvas.height = height;

//           const ctx = canvas.getContext("2d");
//           ctx.drawImage(img, 0, 0, width, height);

//           const base64Image = canvas.toDataURL(file.type);
//           setChangedProfilepic(true);
//           props.setImageUrl(base64Image);
//           setFileName(file.name);
//         };
//       };
//       reader.onerror = (error) => {
//         console.log("Error: ", error);
//       };
//     } else {
//       alert("Error in uploading image");
//     }
//   };

//   const handleImageUpload = async (e) => {
//     e.preventDefault();
//     if (props.imgUrl.length <= 0 || fileName.length <= 0) {
//       alert("NO image selected!");
//       return;
//     }
//     setIsLoading(true);
//     const base64Image = props.imgUrl.split(",")[1];
//     const imgRef = ref(storage, `images/${fileName}`);

//     const snapshot = await uploadString(imgRef, base64Image, "base64");

//     const imgUrl = await getDownloadURL(snapshot.ref);

//     if (!imgUrl) {
//       alert("Can't fetch ImageURL!");
//       return;
//     }

//     await fetch(`http://localhost:7000/api/profile/uploadimage`, {
//       method: "PUT",
//       body: JSON.stringify({
//         imgUrl: imgUrl,
//       }),
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${}`,
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         const userdata = data.user;
//         if (data.status === "Updated Profilepic successfully!") {
//           setIsLoading(false);
//           props.setImageUrl(userdata.profilepic);
//           props.setUserData(userdata);
//         } else {
//           alert("Can't fetch ImageURL!");
//         }
//         setChangedProfilepic(false);
//       })
//       .catch((error) => console.error("Error:", error));
//   };
//   return (
//     <div>
//       {isLoading && <CircularProgress size={props.lsize} sx={{ position: "relative", top: 30, left: 110, zIndex: 2 }} />}
//       {isLoading && <img src={props.imgUrl} alt="profilepic" style={{ width: props.imgWidth, height: props.imgHeight, borderRadius: props.br, filter: "blur(2px)" }} />}
//       {!isLoading && <img src={props.imgUrl} alt="profilepic" style={{ width: props.imgWidth, height: props.imgHeight, borderRadius: props.br }} />}
//       <Button type="input" sx={{ position: "relative", top: 70, right: 45 }}>
//         <label htmlFor="image-upload" className="upload-label">
//           {props.imageType === "profilepic" && <EditTwoToneIcon sx={{ fontSize: "1.7rem" }} />}
//           {props.imageType === "mysubgreddit" && <Button variant="contained">Choose File</Button>}
//           {props.imageType === "post" && <Button variant="contained">Choose File</Button>}
//         </label>
//         <input type="file" id="image-upload" name="image" onChange={handleProfiePicChange} hidden={true} />
//       </Button>
//       <Button hidden={!changedProfilepic} variant="contained" sx={{ backgroundColor: "#3E6417", "&:hover": { backgroundColor: "#253E0B" } }} onClick={handleImageUpload}>
//         Update Profile Pic
//       </Button>
//       <Button
//         hidden={!changedProfilepic}
//         onClick={() => {
//           setChangedProfilepic(false);
//           props.setImageUrl(props.userData.profilepic);
//           setIsLoading(false);
//         }}
//       >
//         Cancel
//       </Button>
//     </div>
//   );
// };

// export default UploadImage;
