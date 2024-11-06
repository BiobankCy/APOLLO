import { Button, Grid, TextField } from "@mui/material";
import { BrowserMultiFormatReader } from "@zxing/library";
import React, { useEffect, useRef, useState } from "react";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

interface BarcodeScannerProps {
  onScan: (data: string) => void;
  dialogOpened: boolean;
  searchingDB: boolean;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, dialogOpened, searchingDB }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reader = useRef(new BrowserMultiFormatReader());
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [videoInputDevices, setVideoInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [startCamera, setStartCamera] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [manualInput, setManualInput] = useState<string>('');
  const timeoutId = useRef<number | undefined>(undefined);
  const intervalId = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Stop the camera when dialogOpened is set to false
    if (!dialogOpened) {
      setStartCamera(false);
    }
  }, [dialogOpened]);

  useEffect(() => {

    setStartCamera(!searchingDB);

  }, [searchingDB]);

  useEffect(() => {
    // Initialize camera devices
    const initializeCameraDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((device) => device.kind === 'videoinput');
        setVideoInputDevices(videoDevices);
        setSelectedDeviceId(videoDevices.length > 0 ? videoDevices[0].deviceId : '');
        setInitialized(true);
      } catch (error) {
        console.error('Error initializing camera devices:', error);
      }
    };

    initializeCameraDevices();

    // Cleanup function to stop the camera and reset the reader
    return () => {
      handleStop();
    };
  }, []); // Empty dependency array for mounting and unmounting only

  useEffect(() => {
    let requestId: number;

    const startDecoding = async () => {
      try {
        const constraints = {
          audio: false,
          video: {
            facingMode: "environment",
            frameRate: { ideal: 60, max: 60 },
            deviceId: selectedDeviceId,
          },
        };

        if (videoRef.current) {
          const result = await reader.current.decodeOnceFromConstraints(constraints, videoRef.current);

          if (result) {
            onScan(result.getText());
            handleStop();
          }

          // Continue decoding by calling startDecoding recursively
          requestId = requestAnimationFrame(startDecoding);
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    if (startCamera && initialized) {
      startDecoding();
    }

    // Cleanup function to stop decoding and reset the reader
    return () => {
      cancelAnimationFrame(requestId);
      reader.current.reset();
    };
  }, [onScan, startCamera, initialized, selectedDeviceId, dialogOpened]);



  const handleStart = () => {
    setStartCamera(true);
  };


  const handleStop = () => {
    setStartCamera(false);

    // if (reader.current) {

    //   reader.current.stopAsyncDecode(); 
    //   reader.current.reset();
    // } 

    // clearTimeout(timeoutId.current);
    // clearInterval(intervalId.current);


    // onScan("");


  };
  const handleManualInput = () => {

    if (manualInput.trim().length > 0) {
      onScan(manualInput);
    }

    setManualInput('');
  };
  // const handleStop = () => {
  //   console.log('Stopping the camera...');
  //   setStartCamera(false);
  //   setTimeout(() => {
  //     reader.current.reset();
  //     onScan("");
  //   }, 100); // Adjust the delay as needed
  // };


  return (
    // <Grid>
    //   <video hidden={!startCamera} ref={videoRef} style={{ width: '100%', height: 'auto' }} />
    //   <Button color={startCamera ? "error" : "success"} variant="contained" onClick={startCamera ? handleStop : handleStart}>
    //     {startCamera ? "Stop" : "Start"}
    //   </Button>
    //   <Select
    //     label="Select Camera"
    //     value={selectedDeviceId}
    //     onChange={(e) => setSelectedDeviceId(e.target.value as string)}
    //     style={{ width: '100%' }}
    //   >
    //     {videoInputDevices.map((device) => (
    //       <MenuItem key={device.deviceId} value={device.deviceId}>
    //         {device.label || `Camera ${videoInputDevices.indexOf(device) + 1}`}
    //       </MenuItem>
    //     ))}
    //   </Select>
    // </Grid>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <video hidden={!startCamera} ref={videoRef} style={{ width: '100%', height: 'auto' }} />
      </Grid>
      <Grid item xs={12}>
        <Button color={startCamera ? "error" : "success"} variant="contained" onClick={startCamera ? handleStop : handleStart}>
          {startCamera ? "Stop" : "Start"}
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Select
          label="Select Camera"
          value={selectedDeviceId}
          onChange={(e) => setSelectedDeviceId(e.target.value as string)}
          style={{ width: '100%' }}
        >
          {videoInputDevices.map((device) => (
            <MenuItem key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${videoInputDevices.indexOf(device) + 1}`}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid item xs={12}>
        <TextField

          label="Manual Input"
          variant="outlined"
          value={manualInput}
          autoComplete="off"
          onChange={(e) => setManualInput(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          disabled={searchingDB ? true : false}
          color="success"
          variant="contained"
          onClick={handleManualInput}
        >
          {searchingDB ? "Searching.." : "Search"}
        </Button>
      </Grid>
    </Grid>
  );
};

export default BarcodeScanner;