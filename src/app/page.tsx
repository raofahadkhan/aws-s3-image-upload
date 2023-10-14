"use client";
import { useEffect, useState } from "react";
import AWS from "aws-sdk";
import axios from "axios";

export default function Home() {
  AWS.config.update({
    accessKeyId: "AKIAQHLGGFVPLYP5JOXA",
    secretAccessKey: "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",
    region: "us-east-1",
  });
  const [image, setImage] = useState<any>();
  const formData = new FormData();
  formData.append("file", image);

  // const postImage = async () => {
  //   const presignedUrl = await fetch(
  //     "https://i33z4hwmv4.execute-api.us-east-1.amazonaws.com/get-presigned-url",
  //     {
  //       method: "POST",
  //       body: JSON.stringify({
  //         name: `store-logos/${image.name}`,
  //         fileType: image.type,
  //       }),
  //     }
  //   );

  //   const res = await presignedUrl.json();
  //   console.log("url first", res);
  //   await fetch(res.url, {
  //     headers: {
  //       "Content-Type": image.type,
  //     },
  //     method: "PUT",
  //     body: formData,
  //   }).then((response) => {
  //     console.log("called second");
  //   });
  // };

  const uploadToS3 = async (file: any, isLogo: any) => {
    try {
      const s3 = new AWS.S3();
      const bucketName = "livecart-store-api-dev-store-images-bucket";

      const params = {
        Bucket: bucketName,
        Key: isLogo ? `store-logos/${file.name}` : `store-photos/${file.name}`,
        ContentType: file.type,
      };

      const presignedUrl = await s3.getSignedUrlPromise("putObject", params);

      await axios.put(presignedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      const imageUrl = `https://${bucketName}.s3.amazonaws.com/${params.Key}`;
      return imageUrl;
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw error;
    }
  };

  useEffect(() => {
    uploadToS3(image, true);
  }, [image]);

  // useEffect(() => {
  //   if (image) {
  //     console.log("image object=>", image);
  //     postImage();
  //   }
  // }, [image]);
  return (
    <>
      <input type="file" onChange={(e: any) => setImage(e.target.files[0])} />
    </>
  );
}
