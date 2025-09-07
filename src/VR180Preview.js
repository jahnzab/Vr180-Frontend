// import React, { useRef, useEffect, useState } from 'react';
// import * as THREE from 'three';

// const VR180Preview = ({ videoSrc, width = 800, height = 400 }) => {
//   const canvasRef = useRef(null);
//   const videoRef = useRef(null);
//   const rendererRef = useRef(null);
//   const sceneRef = useRef(null);
//   const cameraRef = useRef(null);
//   const meshRef = useRef(null);
//   const animationIdRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [videoError, setVideoError] = useState(null);
//   const [videoReady, setVideoReady] = useState(false);

//   useEffect(() => {
//     if (!videoSrc || !canvasRef.current) return;

//     // Initialize Three.js scene
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
//     const renderer = new THREE.WebGLRenderer({ 
//       canvas: canvasRef.current,
//       antialias: true 
//     });
    
//     renderer.setSize(width, height);
//     renderer.setClearColor(0x000000);

//     // Store refs
//     sceneRef.current = scene;
//     cameraRef.current = camera;
//     rendererRef.current = renderer;

//     // Create video element with proper configuration
//     const video = document.createElement('video');
//     video.crossOrigin = 'anonymous';
//     video.loop = true;
//     video.muted = false; // Allow sound
//     video.playsInline = true;
//     video.preload = 'metadata';
//     video.setAttribute('webkit-playsinline', 'true');
    
//     videoRef.current = video;

//     console.log('Loading video from:', videoSrc);

//     // Video event handlers
//     const handleVideoCanPlay = () => {
//       console.log('Video can play');
//       setVideoReady(true);
//       setIsLoading(false);
//       setVideoError(null);
//     };

//     const handleVideoLoadedData = () => {
//       console.log('Video loaded data');
//       setVideoReady(true);
//       setIsLoading(false);
//     };

//     const handleVideoError = (error) => {
//       console.error('Video error:', error, video.error);
//       setVideoError(`Video loading failed: ${video.error?.message || 'Unknown error'}`);
//       setIsLoading(false);
//     };

//     const handleVideoPlay = () => {
//       console.log('Video started playing');
//       setIsPlaying(true);
//     };

//     const handleVideoPause = () => {
//       console.log('Video paused');
//       setIsPlaying(false);
//     };

//     // Add all event listeners
//     video.addEventListener('canplay', handleVideoCanPlay);
//     video.addEventListener('loadeddata', handleVideoLoadedData);
//     video.addEventListener('error', handleVideoError);
//     video.addEventListener('play', handleVideoPlay);
//     video.addEventListener('pause', handleVideoPause);

//     // Create video texture
//     const videoTexture = new THREE.VideoTexture(video);
//     videoTexture.minFilter = THREE.LinearFilter;
//     videoTexture.magFilter = THREE.LinearFilter;
//     videoTexture.format = THREE.RGBFormat;
//     videoTexture.flipY = false;

//     // Create sphere geometry for VR 180
//     // VR 180 only covers 180 degrees, so we create a hemisphere
//     const geometry = new THREE.SphereGeometry(5, 60, 40, 0, Math.PI, 0, Math.PI);
    
//     // Create material with video texture
//     const material = new THREE.MeshBasicMaterial({
//       map: videoTexture,
//       side: THREE.BackSide // Inside view
//     });

//     // Create mesh
//     const mesh = new THREE.Mesh(geometry, material);
//     scene.add(mesh);
//     meshRef.current = mesh;

//     // Position camera
//     camera.position.set(0, 0, 0);
//     camera.lookAt(0, 0, -1);

//     // Add mouse controls for looking around
//     let mouseX = 0;
//     let mouseY = 0;
//     let isMouseDown = false;

//     const onMouseDown = (event) => {
//       isMouseDown = true;
//       mouseX = event.clientX;
//       mouseY = event.clientY;
//     };

//     const onMouseUp = () => {
//       isMouseDown = false;
//     };

//     const onMouseMove = (event) => {
//       if (!isMouseDown) return;

//       const deltaX = event.clientX - mouseX;
//       const deltaY = event.clientY - mouseY;

//       // Rotate camera based on mouse movement
//       const euler = new THREE.Euler(0, 0, 0, 'YXZ');
//       euler.setFromQuaternion(camera.quaternion);
      
//       euler.y -= deltaX * 0.002;
//       euler.x -= deltaY * 0.002;
      
//       // Limit vertical rotation
//       euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));
      
//       camera.quaternion.setFromEuler(euler);

//       mouseX = event.clientX;
//       mouseY = event.clientY;
//     };

//     const canvas = canvasRef.current;
//     canvas.addEventListener('mousedown', onMouseDown);
//     canvas.addEventListener('mouseup', onMouseUp);
//     canvas.addEventListener('mousemove', onMouseMove);
//     canvas.addEventListener('mouseleave', onMouseUp);

//     // Touch controls for mobile
//     let touchX = 0;
//     let touchY = 0;
//     let isTouching = false;

//     const onTouchStart = (event) => {
//       isTouching = true;
//       const touch = event.touches[0];
//       touchX = touch.clientX;
//       touchY = touch.clientY;
//     };

//     const onTouchEnd = () => {
//       isTouching = false;
//     };

//     const onTouchMove = (event) => {
//       if (!isTouching) return;
//       event.preventDefault();

//       const touch = event.touches[0];
//       const deltaX = touch.clientX - touchX;
//       const deltaY = touch.clientY - touchY;

//       const euler = new THREE.Euler(0, 0, 0, 'YXZ');
//       euler.setFromQuaternion(camera.quaternion);
      
//       euler.y -= deltaX * 0.002;
//       euler.x -= deltaY * 0.002;
      
//       euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));
      
//       camera.quaternion.setFromEuler(euler);

//       touchX = touch.clientX;
//       touchY = touch.clientY;
//     };

//     canvas.addEventListener('touchstart', onTouchStart);
//     canvas.addEventListener('touchend', onTouchEnd);
//     canvas.addEventListener('touchmove', onTouchMove);

//     // Load video - try with blob URL directly
//     console.log('Setting video src to:', videoSrc);
//     video.src = videoSrc;
//     video.load(); // Force load

//     // Render loop
//     const animate = () => {
//       animationIdRef.current = requestAnimationFrame(animate);
//       renderer.render(scene, camera);
//     };
//     animate();

//     // Cleanup function
//     return () => {
//       if (animationIdRef.current) {
//         cancelAnimationFrame(animationIdRef.current);
//       }

//       // Remove event listeners
//       const canvas = canvasRef.current;
//       if (canvas) {
//         canvas.removeEventListener('mousedown', onMouseDown);
//         canvas.removeEventListener('mouseup', onMouseUp);
//         canvas.removeEventListener('mousemove', onMouseMove);
//         canvas.removeEventListener('mouseleave', onMouseUp);
//         canvas.removeEventListener('touchstart', onTouchStart);
//         canvas.removeEventListener('touchend', onTouchEnd);
//         canvas.removeEventListener('touchmove', onTouchMove);
//       }

//       if (video) {
//         video.removeEventListener('canplay', handleVideoCanPlay);
//         video.removeEventListener('loadeddata', handleVideoLoadedData);
//         video.removeEventListener('error', handleVideoError);
//         video.removeEventListener('play', handleVideoPlay);
//         video.removeEventListener('pause', handleVideoPause);
        
//         video.pause();
//         video.src = '';
//         video.load();
//       }

//       // Dispose of Three.js resources
//       if (geometry) geometry.dispose();
//       if (material) material.dispose();
//       if (videoTexture) videoTexture.dispose();
//       if (renderer) renderer.dispose();
//     };
//   }, [videoSrc, width, height]);

//   const togglePlay = async () => {
//     if (!videoRef.current || !videoReady) {
//       console.log('Video not ready yet');
//       return;
//     }

//     const video = videoRef.current;
    
//     try {
//       if (isPlaying) {
//         console.log('Pausing video');
//         video.pause();
//       } else {
//         console.log('Playing video');
//         // Ensure video is loaded
//         if (video.readyState >= 2) {
//           await video.play();
//         } else {
//           console.log('Video not ready, waiting...');
//           video.addEventListener('canplay', async () => {
//             try {
//               await video.play();
//             } catch (err) {
//               console.error('Play error after canplay:', err);
//               setVideoError(`Playback failed: ${err.message}`);
//             }
//           }, { once: true });
//         }
//       }
//     } catch (error) {
//       console.error('Toggle play error:', error);
//       setVideoError(`Playback error: ${error.message}`);
//     }
//   };

//   const resetView = () => {
//     if (cameraRef.current) {
//       cameraRef.current.quaternion.set(0, 0, 0, 1);
//       cameraRef.current.position.set(0, 0, 0);
//       cameraRef.current.lookAt(0, 0, -1);
//     }
//   };

//   return (
//     <div className="vr180-preview-container" style={{ position: 'relative' }}>
//       <canvas
//         ref={canvasRef}
//         width={width}
//         height={height}
//         style={{
//           border: '1px solid #ccc',
//           borderRadius: '8px',
//           cursor: 'grab'
//         }}
//       />
      
//       {isLoading && (
//         <div
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             background: 'rgba(0, 0, 0, 0.8)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             color: 'white',
//             borderRadius: '8px',
//             flexDirection: 'column',
//             gap: '10px'
//           }}
//         >
//           <div>Loading VR 180 Video...</div>
//           <div style={{ fontSize: '12px', opacity: 0.8 }}>
//             Video URL: {videoSrc?.substring(0, 50)}...
//           </div>
//         </div>
//       )}

//       {videoError && (
//         <div
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             background: 'rgba(220, 53, 69, 0.9)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             color: 'white',
//             borderRadius: '8px',
//             flexDirection: 'column',
//             gap: '10px',
//             textAlign: 'center',
//             padding: '20px'
//           }}
//         >
//           <div style={{ fontWeight: 'bold' }}>Video Loading Error</div>
//           <div style={{ fontSize: '14px' }}>{videoError}</div>
//           <button
//             onClick={() => {
//               setVideoError(null);
//               setIsLoading(true);
//               if (videoRef.current) {
//                 videoRef.current.load();
//               }
//             }}
//             style={{
//               padding: '8px 16px',
//               background: 'white',
//               color: '#dc3545',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer'
//             }}
//           >
//             Retry
//           </button>
//         </div>
//       )}

//       <div
//         style={{
//           position: 'absolute',
//           bottom: '10px',
//           left: '10px',
//           right: '10px',
//           display: 'flex',
//           gap: '10px',
//           justifyContent: 'center'
//         }}
//       >
//         <button
//           onClick={togglePlay}
//           disabled={!videoReady}
//           style={{
//             padding: '8px 16px',
//             background: videoReady ? (isPlaying ? '#dc3545' : '#007bff') : '#ccc',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: videoReady ? 'pointer' : 'not-allowed'
//           }}
//         >
//           {!videoReady ? 'Loading...' : isPlaying ? 'Pause' : 'Play'}
//         </button>
        
//         <button
//           onClick={switchEye}
//           style={{
//             padding: '8px 16px',
//             background: '#28a745',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer'
//           }}
//         >
//           {currentEye === 'left' ? 'Left Eye' : 'Right Eye'}
//         </button>
        
//         <button
//           onClick={resetView}
//           style={{
//             padding: '8px 16px',
//             background: '#6c757d',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer'
//           }}
//         >
//           Reset View
//         </button>

//         {videoRef.current && (
//           <div style={{
//             padding: '4px 8px',
//             background: 'rgba(0,0,0,0.7)',
//             color: 'white',
//             borderRadius: '4px',
//             fontSize: '10px'
//           }}>
//             Ready: {videoRef.current.readyState}/4 | 
//             Duration: {videoRef.current.duration || 'Loading'} | 
//             Size: {videoRef.current.videoWidth}x{videoRef.current.videoHeight} |
//             Time: {videoRef.current.currentTime.toFixed(1)}s
//           </div>
//         )}
        
//         {/* Debug: Show regular video for comparison */}
//         {process.env.NODE_ENV === 'development' && videoSrc && (
//           <video
//             src={videoSrc}
//             style={{
//               position: 'absolute',
//               top: '10px',
//               left: '10px',
//               width: '100px',
//               height: '60px',
//               border: '1px solid red',
//               opacity: 0.5
//             }}
//             muted
//             autoPlay
//             playsInline
//           />
//         )}
//       </div>

//       <div
//         style={{
//           position: 'absolute',
//           top: '10px',
//           right: '10px',
//           background: 'rgba(0, 0, 0, 0.7)',
//           color: 'white',
//           padding: '4px 8px',
//           borderRadius: '4px',
//           fontSize: '12px'
//         }}
//       >
//         VR 180 - Drag to look around
//       </div>
//     </div>
//   );
// };

// export default VR180Preview;

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const VR180Preview = ({ videoSrc, width = 800, height = 400 }) => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const meshRef = useRef(null);
  const animationIdRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [videoError, setVideoError] = useState(null);
  const [videoReady, setVideoReady] = useState(false);
  const [currentEye, setCurrentEye] = useState('left'); // Added missing state

  useEffect(() => {
    if (!videoSrc || !canvasRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      antialias: true 
    });
    
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000);

    // Store refs
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Create video element with proper configuration
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = false; // Allow sound
    video.playsInline = true;
    video.preload = 'metadata';
    video.setAttribute('webkit-playsinline', 'true');
    
    videoRef.current = video;

    console.log('Loading video from:', videoSrc);

    // Video event handlers
    const handleVideoCanPlay = () => {
      console.log('Video can play');
      setVideoReady(true);
      setIsLoading(false);
      setVideoError(null);
    };

    const handleVideoLoadedData = () => {
      console.log('Video loaded data');
      setVideoReady(true);
      setIsLoading(false);
    };

    const handleVideoError = (error) => {
      console.error('Video error:', error, video.error);
      setVideoError(`Video loading failed: ${video.error?.message || 'Unknown error'}`);
      setIsLoading(false);
    };

    const handleVideoPlay = () => {
      console.log('Video started playing');
      setIsPlaying(true);
    };

    const handleVideoPause = () => {
      console.log('Video paused');
      setIsPlaying(false);
    };

    // Add all event listeners
    video.addEventListener('canplay', handleVideoCanPlay);
    video.addEventListener('loadeddata', handleVideoLoadedData);
    video.addEventListener('error', handleVideoError);
    video.addEventListener('play', handleVideoPlay);
    video.addEventListener('pause', handleVideoPause);

    // Create video texture
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBFormat;
    videoTexture.flipY = false;

    // Create sphere geometry for VR 180
    // VR 180 only covers 180 degrees, so we create a hemisphere
    const geometry = new THREE.SphereGeometry(5, 60, 40, 0, Math.PI, 0, Math.PI);
    
    // Create material with video texture
    const material = new THREE.MeshBasicMaterial({
      map: videoTexture,
      side: THREE.BackSide // Inside view
    });

    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Position camera
    camera.position.set(0, 0, 0);
    camera.lookAt(0, 0, -1);

    // Add mouse controls for looking around
    let mouseX = 0;
    let mouseY = 0;
    let isMouseDown = false;

    const onMouseDown = (event) => {
      isMouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    const onMouseMove = (event) => {
      if (!isMouseDown) return;

      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;

      // Rotate camera based on mouse movement
      const euler = new THREE.Euler(0, 0, 0, 'YXZ');
      euler.setFromQuaternion(camera.quaternion);
      
      euler.y -= deltaX * 0.002;
      euler.x -= deltaY * 0.002;
      
      // Limit vertical rotation
      euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));
      
      camera.quaternion.setFromEuler(euler);

      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const canvas = canvasRef.current;
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseUp);

    // Touch controls for mobile
    let touchX = 0;
    let touchY = 0;
    let isTouching = false;

    const onTouchStart = (event) => {
      isTouching = true;
      const touch = event.touches[0];
      touchX = touch.clientX;
      touchY = touch.clientY;
    };

    const onTouchEnd = () => {
      isTouching = false;
    };

    const onTouchMove = (event) => {
      if (!isTouching) return;
      event.preventDefault();

      const touch = event.touches[0];
      const deltaX = touch.clientX - touchX;
      const deltaY = touch.clientY - touchY;

      const euler = new THREE.Euler(0, 0, 0, 'YXZ');
      euler.setFromQuaternion(camera.quaternion);
      
      euler.y -= deltaX * 0.002;
      euler.x -= deltaY * 0.002;
      
      euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));
      
      camera.quaternion.setFromEuler(euler);

      touchX = touch.clientX;
      touchY = touch.clientY;
    };

    canvas.addEventListener('touchstart', onTouchStart);
    canvas.addEventListener('touchend', onTouchEnd);
    canvas.addEventListener('touchmove', onTouchMove);

    // Load video - try with blob URL directly
    console.log('Setting video src to:', videoSrc);
    video.src = videoSrc;
    video.load(); // Force load

    // Render loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup function
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      // Remove event listeners
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.removeEventListener('mousedown', onMouseDown);
        canvas.removeEventListener('mouseup', onMouseUp);
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('mouseleave', onMouseUp);
        canvas.removeEventListener('touchstart', onTouchStart);
        canvas.removeEventListener('touchend', onTouchEnd);
        canvas.removeEventListener('touchmove', onTouchMove);
      }

      if (video) {
        video.removeEventListener('canplay', handleVideoCanPlay);
        video.removeEventListener('loadeddata', handleVideoLoadedData);
        video.removeEventListener('error', handleVideoError);
        video.removeEventListener('play', handleVideoPlay);
        video.removeEventListener('pause', handleVideoPause);
        
        video.pause();
        video.src = '';
        video.load();
      }

      // Dispose of Three.js resources
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (videoTexture) videoTexture.dispose();
      if (renderer) renderer.dispose();
    };
  }, [videoSrc, width, height]);

  const togglePlay = async () => {
    if (!videoRef.current || !videoReady) {
      console.log('Video not ready yet');
      return;
    }

    const video = videoRef.current;
    
    try {
      if (isPlaying) {
        console.log('Pausing video');
        video.pause();
      } else {
        console.log('Playing video');
        // Ensure video is loaded
        if (video.readyState >= 2) {
          await video.play();
        } else {
          console.log('Video not ready, waiting...');
          video.addEventListener('canplay', async () => {
            try {
              await video.play();
            } catch (err) {
              console.error('Play error after canplay:', err);
              setVideoError(`Playback failed: ${err.message}`);
            }
          }, { once: true });
        }
      }
    } catch (error) {
      console.error('Toggle play error:', error);
      setVideoError(`Playback error: ${error.message}`);
    }
  };

  // Added missing switchEye function
  const switchEye = () => {
    const newEye = currentEye === 'left' ? 'right' : 'left';
    setCurrentEye(newEye);
    
    // For VR180 videos, adjust the texture offset to show left or right eye
    if (meshRef.current && meshRef.current.material && meshRef.current.material.map) {
      const texture = meshRef.current.material.map;
      if (newEye === 'left') {
        // Show left half of the texture (0 to 0.5)
        texture.offset.set(0, 0);
        texture.repeat.set(0.5, 1);
      } else {
        // Show right half of the texture (0.5 to 1)
        texture.offset.set(0.5, 0);
        texture.repeat.set(0.5, 1);
      }
      texture.needsUpdate = true;
    }
  };

  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.quaternion.set(0, 0, 0, 1);
      cameraRef.current.position.set(0, 0, 0);
      cameraRef.current.lookAt(0, 0, -1);
    }
  };

  return (
    <div className="vr180-preview-container" style={{ position: 'relative' }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          cursor: 'grab'
        }}
      />
      
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            borderRadius: '8px',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <div>Loading VR 180 Video...</div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>
            Video URL: {videoSrc?.substring(0, 50)}...
          </div>
        </div>
      )}

      {videoError && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(220, 53, 69, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            borderRadius: '8px',
            flexDirection: 'column',
            gap: '10px',
            textAlign: 'center',
            padding: '20px'
          }}
        >
          <div style={{ fontWeight: 'bold' }}>Video Loading Error</div>
          <div style={{ fontSize: '14px' }}>{videoError}</div>
          <button
            onClick={() => {
              setVideoError(null);
              setIsLoading(true);
              if (videoRef.current) {
                videoRef.current.load();
              }
            }}
            style={{
              padding: '8px 16px',
              background: 'white',
              color: '#dc3545',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          right: '10px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'center'
        }}
      >
        <button
          onClick={togglePlay}
          disabled={!videoReady}
          style={{
            padding: '8px 16px',
            background: videoReady ? (isPlaying ? '#dc3545' : '#007bff') : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: videoReady ? 'pointer' : 'not-allowed'
          }}
        >
          {!videoReady ? 'Loading...' : isPlaying ? 'Pause' : 'Play'}
        </button>
        
        <button
          onClick={resetView}
          style={{
            padding: '8px 16px',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset View
        </button>

        {videoRef.current && (
          <div style={{
            padding: '4px 8px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            borderRadius: '4px',
            fontSize: '10px'
          }}>
            Ready: {videoRef.current.readyState}/4 | 
            Duration: {videoRef.current.duration ? videoRef.current.duration.toFixed(1) : 'Loading'}s | 
            Size: {videoRef.current.videoWidth}x{videoRef.current.videoHeight} |
            Time: {videoRef.current.currentTime.toFixed(1)}s |
            Paused: {videoRef.current.paused ? 'Yes' : 'No'}
          </div>
        )}
        
        {/* Debug: Show regular video for comparison */}
        <video
          src={videoSrc}
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            width: '120px',
            height: '60px',
            border: '2px solid lime',
            opacity: 0.8
          }}
          controls
          muted
          playsInline
        />
      </div>

      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px'
        }}
      >
        VR 180 - Drag to look around
      </div>
    </div>
  );
};

export default VR180Preview;