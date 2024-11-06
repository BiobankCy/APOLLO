import React, { useRef, useEffect } from 'react';
import { EncodeHintType, BrowserQRCodeSvgWriter } from '@zxing/library';

interface QRCodeGeneratorProps {
  data: string;
  size?: number | string; // Optional prop for size, can be a number or a percentage string
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ data, size = '100%' }) => {
  const containerRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {


    if (containerRef.current && data) {

      // Ensure containerRef.current is of type SVGSVGElement
      if (containerRef.current instanceof SVGSVGElement) {

        const svgElement = containerRef.current;

        // Use the BrowserQRCodeSvgWriter to create a QR code
        const writer = new BrowserQRCodeSvgWriter();

        // Initialize actualWidth and actualHeight with default values
        let actualWidth: number = 0;
        let actualHeight: number = 0;

        if (typeof size === 'number') {
          // If size is a number, use it as the fixed size
          actualWidth = size;
          actualHeight = size;
        } else if (typeof size === 'string') {
          // If size is a string, assume it's a percentage
          const percentage = parseInt(size, 10) / 100;
          actualWidth = svgElement.clientWidth * percentage;
          actualHeight = svgElement.clientHeight * percentage;
        }

        // Set the dimensions and viewBox of the SVG
        svgElement.setAttribute('width', actualWidth.toString());
        svgElement.setAttribute('height', actualHeight.toString());

        // Write the QR code to the container
        const svgCode = writer.write(data, actualWidth, actualHeight, new Map<EncodeHintType, any>());
        svgElement.innerHTML = ''; // Clear previous content

        svgElement.appendChild(svgCode);



      }
    }
  }, [data, size]);

  return <svg ref={containerRef}></svg>;
};

export default QRCodeGenerator;
