import { Button, Card, Form, Col, message, Select } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { drawFaceRect } from "./drawFaceRect";
import { getFullFaceDescription } from "./index";

let  DEFAULT_WEBCAM_RESOLUTION = {
    label: '640x480',
    width: 640,
    height: 480,
  };
let  inputSize ; 




const { Option } = Select;

export const UploadFromWebcam = ({
  loading,
}) => {
  const [camWidth, setCamWidth] = useState(DEFAULT_WEBCAM_RESOLUTION.width);
  const [camHeight, setCamHeight] = useState(DEFAULT_WEBCAM_RESOLUTION.height);
  const [inputDevices, setInputDevices] = useState([]);
  const [selectedWebcam, setSelectedWebcam] = useState();

  const [fullDesc, setFullDesc] = useState(null);

  const [faceDescriptor, setFaceDescriptor] = useState([]);

  const [detectionCount, setDetectionCount] = useState(0);
  const [previewImage, setPreviewImage] = useState("");

  const [waitText, setWaitText] = useState("");

  const webcamRef = useRef();
  const canvasRef = useRef();

 

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(async (devices) => {
      let inputDevice = await devices.filter(
        (device) => device.kind === "videoinput"
      );
      setInputDevices({ ...inputDevices, inputDevice });
    });
  }, []);

  useEffect(() => {
    function capture() {
      if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
      ) {
        setPreviewImage(webcamRef.current.getScreenshot());

        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        // Set canvas height and width
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        // 4. TODO - Make Detections
        // e.g. const obj = await net.detect(video);
        
        // console.log("hello");
        // Draw mesh
        getFullFaceDescription(webcamRef.current.getScreenshot(), inputSize)
          .then((data) => {
            setFullDesc(data);
            setFaceDescriptor(data[0]?.descriptor);
            setWaitText("");
          })
          .catch((err) => {
            setWaitText(
              "Preparing face matcher and device setup, please wait..."
            );
          });
        const ctx = canvasRef.current.getContext("2d");

        drawFaceRect(fullDesc, ctx);
      }
    }

    let interval = setInterval(() => {
      capture();
      // console.log("hjhjh")
    }, 700);

    return () => clearInterval(interval);
  });



  return (
    <Card>
     

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Webcam
          muted={true}
          ref={webcamRef}
          audio={false}
          width={camWidth}
          height={camHeight}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            deviceId: selectedWebcam,
          }}
          mirrored
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            textAlign: "center",
            zindex: 8,
            width: camWidth,
            height: camHeight,
          }}
        />
      </div>
{previewImage && (
          <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          >
            <h3>Previous Capture: </h3>
            <img
              src={previewImage}
              alt="Capture"
              style={{ width: "200px", height: "200px" }}
            />
            <div style={{ marginTop: "10px" }}>
              <Button
                type="primary"
                // onClick={handleSubmit}
                disabled={
                  loading ||
                  (fullDesc && fullDesc.length !== 1) ||
                  (faceDescriptor && faceDescriptor.length !== 128)
                }
                loading={loading}
              >
                Save
              </Button>
            </div>
          </div>
        )}

      
    </Card>
  );
};