import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Angry, Frown, Laugh, Loader, Meh, ScanFace } from "lucide-react";
import { FaRegFaceSadTear } from "react-icons/fa6";
import { LiaSurprise } from "react-icons/lia";

const FaceAuth = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [active, setActive] = useState<boolean>(false);
  const [clicked, setClicked] = useState<boolean>(false);
  const [faceDetected, setFaceDetected] = useState<boolean>(false);
  const [expression, setExpression] = useState<string>("");
  const [data, setData] = useState<any>(null);
  const [lightingStatus, setLightingStatus] = useState<string>("normal");
  const intervalRef = useRef<NodeJS.Timer | undefined>(undefined);

  const stopVideoStream = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    setActive(false);
    setExpression("");
    setLightingStatus("normal");
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current as unknown as number);
      }
      stopVideoStream();
    };
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";

      // Load all necessary models
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);

      setLoading(false);
      console.log("models loaded");
    };
    loadModels();

    const checkBrowserCompatibility = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      // Check if running on iOS Safari below version 14.3
      const isIOSSafari = /iPhone|iPad|iPod/i.test(navigator.userAgent) && 
                         /WebKit/i.test(navigator.userAgent) &&
                         !/(CriOS|FxiOS|OPiOS|mercury)/i.test(navigator.userAgent);
      
      if (isIOSSafari) {
        const match = navigator.userAgent.match(/OS (\d+)_(\d+)/);
        if (match) {
          const version = parseInt(match[1], 10);
          if (version < 14) {
            alert("This feature requires iOS 14.3 or later. Please update your device or try a different browser.");
            return false;
          }
        }
      }
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices?.getUserMedia) {
        if (isMobile) {
          alert("Your mobile browser doesn't support camera access. Please try Chrome or Safari.");
        } else {
          alert("Your browser doesn't support camera access. Please try a modern browser like Chrome, Firefox, or Safari.");
        }
        return false;
      }
      
      return true;
    };

    checkBrowserCompatibility();
  }, []);

  const startVideo = async () => {
    setClicked(!clicked);

    // If stopping the video
    if (clicked) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current as NodeJS.Timeout);
        intervalRef.current = undefined;
      }
      stopVideoStream();
      return;
    }

    // If starting the video
    const scan = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("getUserMedia is not supported in this browser");
        }

        setActive(true);
        const constraints = {
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
            exposureMode: "continuous",
            exposureCompensation: 0,
            brightness: { min: 0, max: 255 },
            contrast: { min: 0, max: 255 },
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };

    // Start scanning immediately
    await scan();

    // Set up interval for continuous scanning
    intervalRef.current = setInterval(scan, 5000);
  };

  const options = new faceapi.TinyFaceDetectorOptions({
    inputSize: 416,
    scoreThreshold: 0.1,
  });

  // Function to analyze image brightness
  const analyzeBrightness = (canvas: HTMLCanvasElement) => {
    const context = canvas.getContext("2d");
    if (!context) return;

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let sum = 0;

    // Calculate average brightness
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      sum += brightness;
    }

    const avgBrightness = sum / (data.length / 4);

    if (avgBrightness < 50) {
      setLightingStatus("low");
    } else if (avgBrightness > 200) {
      setLightingStatus("high");
    } else {
      setLightingStatus("normal");
    }
  };

  const handleFaceDetection = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = videoRef.current.videoWidth;
      tempCanvas.height = videoRef.current.videoHeight;
      const tempContext = tempCanvas.getContext("2d");
      if (tempContext) {
        tempContext.drawImage(videoRef.current, 0, 0);
        analyzeBrightness(tempCanvas);
      }

      let detections = await faceapi
        .detectAllFaces(videoRef.current, options)
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withFaceExpressions();

      if (detections.length === 0 && lightingStatus === "low") {
        const lowLightOptions = new faceapi.TinyFaceDetectorOptions({
          inputSize: 416,
          scoreThreshold: 0.05, // Lower threshold for dark environments
        });
        detections = await faceapi
          .detectAllFaces(videoRef.current, lowLightOptions)
          .withFaceLandmarks()
          .withFaceDescriptors()
          .withFaceExpressions();
      }

      if (detections.length === 0) {
        console.log("No face detected.");
        setFaceDetected(false);
        return;
      }

      // console.log("Face detected:", detections[0].expressions);
      setFaceDetected(true);
      setData(detections[0].expressions);

      if (faceDetected) {
        const expressionArray = Object.entries(data).map(([name, value]) => ({
          name,
          value,
        }));
        const sortedExpressions = expressionArray.sort(
          (a: any, b: any) => b.value - a.value
        );
        const dominantExpression = sortedExpressions[0];
        console.log(dominantExpression);
        setExpression(dominantExpression.name);
      }

      const canvas = faceapi.createCanvasFromMedia(videoRef.current);
      canvasRef.current.innerHTML = "";
      canvasRef.current.appendChild(canvas);

      const displaySize = {
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      };
      faceapi.matchDimensions(canvas, displaySize);

      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      const context = canvas.getContext("2d");
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      }
    } catch (err) {
      console.error("Error during face detection:", err);
    }
  };

  return (
    <div className="bg-[#090909] rounded-xl h-[450px] w-[270px] overflow-hidden ">
      {loading ? (
        <div className="h-full w-full flex items-center justify-center flex-col">
          <p>Loading models...</p>
          <Loader className="animate-spin"/>
        </div>
      ) : (
        <div className="p-5 flex flex-col items-center justify-between w-full h-full">
          <div className="flex flex-col gap-5 items-center justify-center text-center">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2 items-center">
                <Laugh
                  strokeWidth="2"
                  color={expression == "happy" ? "#5283f9" : "white"}
                />
                <Frown
                  strokeWidth="2"
                  color={expression == "fearful" ? "#5283f9" : "white"}
                />
                <Meh
                  strokeWidth="2"
                  color={expression == "neutral" ? "#5283f9" : "white"}
                />
                <Angry
                  strokeWidth="2"
                  color={expression == "angry" ? "#5283f9" : "white"}
                />
                <FaRegFaceSadTear
                  color={expression == "sad" ? "#5283f9" : "white"}
                  size={23}
                />
                <LiaSurprise
                  color={expression == "surprised" ? "#5283f9" : "white"}
                  size={30}
                />
              </div>
            </div>

            <div className="relative w-[200px] h-[200px] flex flex-col items-center rounded-full">
              {active ? (
                <div
                  className={`border-2 ${
                    faceDetected
                      ? "border-green-500"
                      : lightingStatus === "low"
                      ? "border-yellow-500"
                      : lightingStatus === "high"
                      ? "border-yellow-500"
                      : "border-red-500"
                  } w-full h-full rounded-full overflow-hidden`}
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    onPlay={handleFaceDetection}
                    className="rounded-full w-full h-full"
                    style={{ transform: "scaleX(-1) scale(2)"}}
                  />
                  <canvas
                    ref={canvasRef}
                    className="w-[200px] h-[200px] absolute top-0 rounded-full"
                  />
                </div>
              ) : (
                <div className="w-[200px] h-[200px] overflow-hidden rounded-full border border-blue-500 border-2 p-1">
                  <div className="bg-blue-500/10 rounded-full h-full w-full flex flex-col justify-center items-center">
                    <ScanFace
                      className="text-blue-500 animate-pulse"
                      size={40}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="w-full flex items-center justify-center flex-col gap-2">
            <button
              className="text-white bg-blue-500 w-full p-2 rounded"
              onClick={startVideo}
            >
              {clicked ? "Stop" : "Scan my face"}
            </button>
            <p className="text-gray-500 text-sm text-center">
              {lightingStatus === "low"
                ? "Warning: Low light detected"
                : lightingStatus === "high"
                ? "Warning: Too bright"
                : "Tips: Use good lighting for better face recognition"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceAuth;
