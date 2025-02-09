import { Suspense, useState, useEffect, useCallback, useMemo } from "react";
import { useVrm } from "../utils/loadVrm";
import { Canvas } from "@react-three/fiber";
import {
  Stars,
  OrbitControls,
  Sky,
  Environment,
  AdaptiveDpr,
  Center,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Noise,
  HueSaturation,
  Pixelation,
} from "@react-three/postprocessing";
// import { BlendFunction } from "postprocessing";
import { useDropzone } from "react-dropzone";

import { firestoreRef } from "../utils/firebase";

import Download from "./Download";
import VRMLooker from "./VRMLooker";
import Ground from "./Ground";
import Picker from "./Picker";

import Slider from "@material-ui/core/Slider";
import Switch from "@material-ui/core/Switch";

import poses from "../poses/poses.json";
import backgroundPresets from "../background/backgroundPresets.json";

import { Link } from "react-router-dom";

import nz from "../assets/cubemap/nz.png";
import nx from "../assets/cubemap/nx.png";
import ny from "../assets/cubemap/ny.png";
import px from "../assets/cubemap/px.png";
import pz from "../assets/cubemap/pz.png";
import py from "../assets/cubemap/py.png";
import { DirectionalLight } from "three";

const baseStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  width: 300,
  borderRadius: 10,
  borderColor: "#000000",
  borderStyle: "solid",
  backgroundColor: "#000000",
  color: "#ffffff",
  outline: "none",
  transition: "border .24s ease-in-out",
};

function Body(props) {
  // Meebits that were passed after fetching them
  const meebits = props.meebits;

  // VRM Loader
  const { vrm, loadVrm } = useVrm();

  // Gets the current pose
  const [pose, setPose] = useState();

  // Settings
  const [showSettings, setShowSettings] = useState(false);
  const [showBodySettings, setShowBodySettings] = useState(false);
  const [showMeebitsSettings, setMeebitsSettings] = useState(false);
  const [showPoseSettings, setPoseSettings] = useState(false);

  // Environment
  const [rotate, setRotate] = useState(false);
  const [sky, setSky] = useState(false);
  const [grid, setGrid] = useState(false);
  const [stars, setStars] = useState(false);
  const [environment, setEnvironment] = useState(false);
  const [ground, setGround] = useState(true);

  // Effects
  // const [chromatic, setChromatic] = useState(false);
  // const [chromaticX, setChromaticX] = useState(0.02);
  // const [chromaticY, setChromaticY] = useState(0.002);

  const [pixelation, setPixelation] = useState(false);
  const [pixelationValue, setPixelationValue] = useState(30);

  // Sky
  const [skyMieDirectionalG, setSkyMieDirectionalG] = useState(0.3);
  const [skyMieCoefficent, setSkyMieCoefficent] = useState(0.08);
  const [skyRayleigh, setSkyRayleigh] = useState(8.7);
  const [skyTurbidity, setSkyTurbidity] = useState(8);
  const [xPos, setXPos] = useState(-1);
  const [yPos, setYPos] = useState(3);
  const [zPos, setZPos] = useState(90);

  // Head
  const [head, setHead] = useState(false);

  // Left Arms
  const [lArmPosX, setlArmPosX] = useState(0);
  const [lArmPosY, setlArmPosY] = useState(0);
  const [lArmPosZ, setlArmPosZ] = useState(0);
  const [lHandPosX, setlHandPosX] = useState(0);
  const [lHandPosY, setlHandPosY] = useState(0);
  const [lHandPosZ, setlHandPosZ] = useState(0);

  // Right Arms
  const [rArmPosX, setrArmPosX] = useState(0);
  const [rArmPosY, setrArmPosY] = useState(0);
  const [rArmPosZ, setrArmPosZ] = useState(0);
  const [rHandPosX, setrHandPosX] = useState(0);
  const [rHandPosY, setrHandPosY] = useState(0);
  const [rHandPosZ, setrHandPosZ] = useState(0);

  // Left Leg
  const [leftUpperLegX, setlUpperLegX] = useState(0);
  const [leftUpperLegY, setlUpperLegY] = useState(0);
  const [leftUpperLegZ, setlUpperLegZ] = useState(0);
  const [leftLowerLegX, setlLowerLegX] = useState(0);
  const [leftLowerLegY, setlLowerLegY] = useState(0);
  const [leftLowerLegZ, setlLowerLegZ] = useState(0);

  // Right Leg
  const [rightUpperLegX, setrUpperLegX] = useState(0);
  const [rightUpperLegY, setrUpperLegY] = useState(0);
  const [rightUpperLegZ, setrUpperLegZ] = useState(0);
  const [rightLowerLegX, setrLowerLegX] = useState(0);
  const [rightLowerLegY, setrLowerLegY] = useState(0);
  const [rightLowerLegZ, setrLowerLegZ] = useState(0);

  // Back
  const [spineX, setSpineX] = useState(0);
  const [spineY, setSpineY] = useState(0);
  const [spineZ, setSpineZ] = useState(0);

  // Hips
  const [hipX, setHipX] = useState(0);
  const [hipY, setHipY] = useState(0);
  const [hipZ, setHipZ] = useState(0);

  // Head
  const [headX, setHeadX] = useState(0);
  const [headY, setHeadY] = useState(0);
  const [headZ, setHeadZ] = useState(0);

  // Community poses
  const [communityPoses, setCommunityPoses] = useState([]);

  // Handles slider changes
  const handleRotate = (e) => {
    setRotate(e.target.checked);
  };

  const handleSky = (e) => {
    setSky(e.target.checked);
  };

  const handleGrid = (e) => {
    setGrid(e.target.checked);
  };

  const handleStars = (e) => {
    setStars(e.target.checked);
  };

  const handleSkyMieDirectionalG = (e, nv) => {
    setSkyMieDirectionalG(nv);
  };

  const handleSkyMieCoefficient = (e, nv) => {
    setSkyMieCoefficent(nv);
  };

  const handleSkyRayleigh = (e, nv) => {
    setSkyRayleigh(nv);
  };

  const handleSkyTurbidity = (e, nv) => {
    setSkyTurbidity(nv);
  };

  const handleXPos = (e, nv) => {
    setXPos(nv);
  };

  const handleYPos = (e, nv) => {
    setYPos(nv);
  };

  const handleZPos = (e, nv) => {
    setZPos(nv);
  };

  const handleEnvironment = (e) => {
    setEnvironment(e.target.checked);
  };

  const handleGround = (e) => {
    setGround(e.target.checked);
  };

  const handleHead = (e) => {
    setHead(e.target.checked);
  };

  const handleLArmPosX = (e, nv) => {
    setlArmPosX(nv);
  };

  const handleLArmPosY = (e, nv) => {
    setlArmPosY(nv);
  };

  const handleLArmPosZ = (e, nv) => {
    setlArmPosZ(nv);
  };

  const handleLHandPosX = (e, nv) => {
    setlHandPosX(nv);
  };

  const handleLHandPosY = (e, nv) => {
    setlHandPosY(nv);
  };

  const handleLHandPosZ = (e, nv) => {
    setlHandPosZ(nv);
  };

  const handleRArmPosX = (e, nv) => {
    setrArmPosX(nv);
  };

  const handleRArmPosY = (e, nv) => {
    setrArmPosY(nv);
  };

  const handleRArmPosZ = (e, nv) => {
    setrArmPosZ(nv);
  };

  const handleRHandPosX = (e, nv) => {
    setrHandPosX(nv);
  };

  const handleRHandPosY = (e, nv) => {
    setrHandPosY(nv);
  };

  const handleRHandPosZ = (e, nv) => {
    setrHandPosZ(nv);
  };

  const handleLUpperLegPosX = (e, nv) => {
    setlUpperLegX(nv);
  };

  const handleLUpperLegPosY = (e, nv) => {
    setlUpperLegY(nv);
  };

  const handleLUpperLegPosZ = (e, nv) => {
    setlUpperLegZ(nv);
  };

  const handleLLowerLegPosX = (e, nv) => {
    setlLowerLegX(nv);
  };

  const handleLLowerLegPosY = (e, nv) => {
    setlLowerLegY(nv);
  };

  const handleLLowerLegPosZ = (e, nv) => {
    setlLowerLegZ(nv);
  };

  const handleRUpperLegPosX = (e, nv) => {
    setrUpperLegX(nv);
  };

  const handleRUpperLegPosY = (e, nv) => {
    setrUpperLegY(nv);
  };

  const handleRUpperLegPosZ = (e, nv) => {
    setrUpperLegZ(nv);
  };

  const handleRLowerLegPosX = (e, nv) => {
    setrLowerLegX(nv);
  };

  const handleRLowerLegPosY = (e, nv) => {
    setrLowerLegY(nv);
  };

  const handleRLowerLegPosZ = (e, nv) => {
    setrLowerLegZ(nv);
  };

  const handleSpineX = (e, nv) => {
    setSpineX(nv);
  };

  const handleSpineY = (e, nv) => {
    setSpineY(nv);
  };

  const handleSpineZ = (e, nv) => {
    setSpineZ(nv);
  };

  const handleHipX = (e, nv) => {
    setHipX(nv);
  };

  const handleHipY = (e, nv) => {
    setHipY(nv);
  };

  const handleHipZ = (e, nv) => {
    setHipZ(nv);
  };

  const handleHeadX = (e, nv) => {
    setHeadX(nv);
  };

  const handleHeadY = (e, nv) => {
    setHeadY(nv);
  };

  const handleHeadZ = (e, nv) => {
    setHeadZ(nv);
  };

  // const handleChromatic = (e) => {
  //   setChromatic(e.target.checked);
  // };

  // const setChromaticXValue = (e, nv) => {
  //   setChromaticX(nv);
  // };

  // const setChromaticYValue = (e, nv) => {
  //   setChromaticY(nv);
  // };

  const handlePixelation = (e) => {
    setPixelation(e.target.checked);
  };

  const handlePixelationValue = (e, nv) => {
    setPixelationValue(nv);
  };

  // Upload pose
  const onDrop = useCallback((af) => {
    af.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("File aborted");
      reader.onerror = () => console.log("File reader failed");
      reader.onload = () => {
        const pose = JSON.parse(reader.result);
        handlePoseSettings(pose);
      };

      reader.readAsText(file);
    });
  }, []);

  // Settings for the dropzone
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".json",
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
    }),
    []
  );

  // Set deafult Pose Settings
  const defaultPoseSettings = () => {
    // Update state for latest pose
    setPose();

    //left Arms
    setlArmPosX(0);
    setlArmPosY(0);
    setlArmPosZ(0);
    setlHandPosX(0);
    setlHandPosY(0);
    setlHandPosZ(0);

    // Right Arms
    setrArmPosX(0);
    setrArmPosY(0);
    setrArmPosZ(0);
    setrHandPosX(0);
    setrHandPosY(0);
    setrHandPosZ(0);

    // Left Leg
    setlUpperLegX(0);
    setlUpperLegY(0);
    setlUpperLegZ(0);
    setlLowerLegX(0);
    setlLowerLegY(0);
    setlLowerLegZ(0);

    // Right Leg
    setrUpperLegX(0);
    setrUpperLegY(0);
    setrUpperLegZ(0);
    setrLowerLegX(0);
    setrLowerLegY(0);
    setrLowerLegZ(0);

    // Back
    setSpineX(0);
    setSpineY(0);
    setSpineZ(0);

    // Hips
    setHipX(0);
    setHipY(0);
    setHipZ(0);

    // Head
    setHeadX(0);
    setHeadY(0);
    setHeadZ(0);
  };

  // Handle Pose Settings
  const handlePoseSettings = (pose) => {
    setPose(pose);

    //left Arms
    setlArmPosX(pose.lArmPosX);
    setlArmPosY(pose.lArmPosY);
    setlArmPosZ(pose.lArmPosZ);
    setlHandPosX(pose.lHandPosX);
    setlHandPosY(pose.lHandPosY);
    setlHandPosZ(pose.lHandPosZ);

    // Right Arms
    setrArmPosX(pose.rArmPosX);
    setrArmPosY(pose.rArmPosY);
    setrArmPosZ(pose.rArmPosZ);
    setrHandPosX(pose.rHandPosX);
    setrHandPosY(pose.rHandPosY);
    setrHandPosZ(pose.rHandPosZ);

    // Left Leg
    setlUpperLegX(pose.leftUpperLegX);
    setlUpperLegY(pose.leftUpperLegY);
    setlUpperLegZ(pose.leftUpperLegZ);
    setlLowerLegX(pose.leftLowerLegX);
    setlLowerLegY(pose.leftLowerLegY);
    setlLowerLegZ(pose.leftLowerLegZ);

    // Right Leg
    setrUpperLegX(pose.rightUpperLegX);
    setrUpperLegY(pose.rightUpperLegY);
    setrUpperLegZ(pose.rightUpperLegZ);
    setrLowerLegX(pose.rightLowerLegX);
    setrLowerLegY(pose.rightLowerLegY);
    setrLowerLegZ(pose.rightLowerLegZ);

    // Back
    setSpineX(pose.spineX);
    setSpineY(pose.spineY);
    setSpineZ(pose.spineZ);

    // Hips
    setHipX(pose.hipX);
    setHipY(pose.hipY);
    setHipZ(pose.hipZ);

    // Head
    setHeadX(pose.headX);
    setHeadY(pose.headY);
    setHeadZ(pose.headZ);
  };

  // TODO: Set a random pose
  const getRandomPose = () => {
    const len = poses.length;
    const randomNum = Math.floor(Math.random() * len);
    const pose = poses[randomNum];

    handlePoseSettings(pose);
  };

  const downloadPose = async () => {
    // Get the pose config
    const pose = {
      lArmPosX: lArmPosX,
      lArmPosY: lArmPosY,
      lArmPosZ: lArmPosZ,
      lHandPosX: lHandPosX,
      lHandPosY: lHandPosY,
      lHandPosZ: lHandPosZ,
      rArmPosX: rArmPosX,
      rArmPosY: rArmPosY,
      rArmPosZ: rArmPosZ,
      rHandPosX: rHandPosX,
      rHandPosY: rHandPosY,
      rHandPosZ: rHandPosZ,
      leftUpperLegX: leftUpperLegX,
      leftUpperLegY: leftUpperLegY,
      leftUpperLegZ: leftUpperLegZ,
      leftLowerLegX: leftLowerLegX,
      leftLowerLegY: leftLowerLegY,
      leftLowerLegZ: leftLowerLegZ,
      rightUpperLegX: rightUpperLegX,
      rightUpperLegY: rightUpperLegY,
      rightUpperLegZ: rightUpperLegZ,
      rightLowerLegX: rightLowerLegX,
      rightLowerLegY: rightLowerLegY,
      rightLowerLegZ: rightLowerLegZ,
      spineX: spineX,
      spineY: spineY,
      spineZ: spineZ,
      hipX: hipX,
      hipY: hipY,
      hipZ: hipZ,
      headX: headX,
      headY: headY,
      headZ: headZ,
    };

    // Set Json, turn into blob and create an object url
    const jsonPose = JSON.stringify(pose);
    const blob = new Blob([[jsonPose]], { type: "application/json" });
    const href = await URL.createObjectURL(blob);

    // Create anchor tag for download
    const link = document.createElement("a");
    link.href = href;
    link.download = "MeeviewPose.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Default background changes
  const defaultBackgroundChanges = () => {
    setRotate(false);
    setSky(false);
    setGrid(false);
    setStars(false);
    setEnvironment(false);
    setGround(true);

    setSkyMieDirectionalG(0.3);
    setSkyMieCoefficent(0.08);
    setSkyRayleigh(8.7);
    setSkyTurbidity(8);
    setXPos(-1);
    setYPos(3);
    setZPos(90);
  };

  // Handle background changes
  const handleBackgroundChanges = (background) => {
    setRotate(background.rotate);
    setSky(background.sky);
    setGrid(background.grid);
    setStars(background.stars);
    setEnvironment(background.environment);
    setGround(background.ground);

    setSkyMieDirectionalG(background.skyMieDirectionalG);
    setSkyMieCoefficent(background.mieCoefficient);
    setSkyRayleigh(background.skyRayleigh);
    setSkyTurbidity(background.skyTurbidity);
    setXPos(background.xPos);
    setYPos(background.yPos);
    setZPos(background.zPos);
  };

  // Set Random background
  const getRandomBackground = () => {
    const len = backgroundPresets.length;
    const randomNum = Math.floor(Math.random() * len);
    const backgroundPreset = backgroundPresets[randomNum];

    handleBackgroundChanges(backgroundPreset);
  };

  const handleSettings = (settings) => {
    if (settings === "body") {
      setShowBodySettings(true);
      setShowSettings(false);
      setMeebitsSettings(false);
      setPoseSettings(false);
      if (showBodySettings === true) {
        setShowBodySettings(false);
      }
    } else if (settings === "background") {
      setShowSettings(true);
      setShowBodySettings(false);
      setMeebitsSettings(false);
      setPoseSettings(false);
      if (showSettings === true) {
        setShowSettings(false);
      }
    } else if (settings === "meebits") {
      setMeebitsSettings(true);
      setShowBodySettings(false);
      setShowSettings(false);
      setPoseSettings(false);
      if (showMeebitsSettings === true) {
        setMeebitsSettings(false);
      }
    } else if (settings === "pose") {
      setPoseSettings(true);
      setMeebitsSettings(false);
      setShowBodySettings(false);
      setShowSettings(false);
      if (showPoseSettings === true) {
        setPoseSettings(false);
      }
    }
  };

  const changeVrm = (index) => {
    loadVrm(window.URL.createObjectURL(meebits[index]));
  };

  useEffect(() => {
    if (meebits !== undefined) {
      loadVrm(window.URL.createObjectURL(meebits[0]));
    }
  }, [meebits]);

  useEffect(() => {
    const fetchPoses = async () => {
      const items = [];

      const fileRef = firestoreRef.collection("gallery");

      fileRef.onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let data = doc.data();

          let payload = {
            pose: data.pose,
            poseName: data.poseName,
          };

          items.push(payload);
        });
      });

      setCommunityPoses(items);
    };

    fetchPoses();
  }, []);

  return (
    <div className="flex">
      <div id="screenshot" className="relative z-0 w-full h-screen">
        <Canvas
          dpr={window.devicePixelRatio}
          gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
          linear={true}
          flat={true}
          mode="concurrent"
          frameloop="demand"
          camera={{ position: [0, -5, -10], fov: 24 }}
        >
          <Center>
            <VRMLooker
              vrmFile={vrm}
              headLock={head}
              lArmX={lArmPosX}
              lArmY={lArmPosY}
              lArmZ={lArmPosZ}
              lHandX={lHandPosX}
              lHandY={lHandPosY}
              lHandZ={lHandPosZ}
              rArmX={rArmPosX}
              rArmY={rArmPosY}
              rArmZ={rArmPosZ}
              rHandX={rHandPosX}
              rHandY={rHandPosY}
              rHandZ={rHandPosZ}
              leftULegX={leftUpperLegX}
              leftULegY={leftUpperLegY}
              leftULegZ={leftUpperLegZ}
              leftLLegX={leftLowerLegX}
              leftLLegY={leftLowerLegY}
              leftLLegZ={leftLowerLegZ}
              rightULegX={rightUpperLegX}
              rightULegY={rightUpperLegY}
              rightULegZ={rightUpperLegZ}
              rightLLegX={rightLowerLegX}
              rightLLegY={rightLowerLegY}
              rightLLegZ={rightLowerLegZ}
              spX={spineX}
              spY={spineY}
              spZ={spineZ}
              hX={hipX}
              hY={hipY}
              hZ={hipZ}
              hdX={headX}
              hdY={headY}
              hdZ={headZ}
            />
          </Center>

          {ground === true ? <Ground /> : null}

          <OrbitControls
            minPolarAngle={1.5}
            maxPolarAngle={1.5}
            minDistance={5}
            maxDistance={10}
            enablePan={false}
            enableZoom={true}
            autoRotate={rotate}
          />

          {grid === true ? (
            <gridHelper args={[100, 50]} position={[0, -1, 0]} />
          ) : null}

          {stars === true ? (
            <Stars
              radius={25}
              depth={500}
              count={9000}
              factor={10}
              saturation={100}
            />
          ) : null}

          {sky === true ? (
            <Sky
              distance={450000}
              sunPosition={[xPos, yPos, zPos]}
              mieCoefficient={skyMieCoefficent}
              mieDirectionalG={skyMieDirectionalG}
              rayleigh={skyRayleigh}
              turbidity={skyTurbidity}
            />
          ) : null}

          {environment === true ? (
            <Suspense fallback={null}>
              <Environment
                background={environment}
                files={[px, nx, py, ny, pz, nz]}
                preset={null}
              />
            </Suspense>
          ) : null}

          <ambientLight intensity={0.85} />
          {/* <hemisphereLight
            color={0xffeeb1}
            groundColor={0x080810}
            intensity={3.5}
          /> */}
          <directionalLight
            color={0x080810} 
            intensity={0.25}
            position={[0,-1,0]}
          />
          <pointLight
            color={0x080810}
            position={[1, -19, -35]}
            intensity={4.5}
          />
          {/* <spotLight color={0x080810} position={[1, -20, -50]} intensity={12} angle={1} distance={50} penumbra={0.1} /> */}
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.2}
              luminanceSmoothing={0.5}
              intensity={0.3}
            />
            <Noise opacity={0.001} />
            <HueSaturation saturation={0.2} />
            <AdaptiveDpr />

            {/* {chromatic === true ? (
              <ChromaticAberration
                blendFunction={BlendFunction.Normal}
                offset={[chromaticX, chromaticY]}
              />
            ) : null} */}

            {pixelation === true ? (
              <Pixelation granularity={pixelationValue} />
            ) : null}
          </EffectComposer>
        </Canvas>
      </div>

      <div className="absolute z-20 top-3 right-3">
        <button
          className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 bg-black hover:bg-gray-900 focus:outline-none text-white font-bold h-10 w-32 rounded-full"
          onClick={() => handleSettings("background")}
        >
          <span>Background</span>
        </button>
      </div>

      {showSettings === true ? (
        <div className="absolute z-20 top-24 right-3 w-96 bg-gray-100 rounded-lg mt-5 ml-2 mr-2 h-4/6 overflow-auto">
          <div className="m-5">
            <h1 className="font-nimbus text-lg font-bold text-left">
              Background Settings
            </h1>

            <div className="flex-col">
              <div className="mt-3">
                <button
                  className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 bg-black hover:bg-gray-900 focus:outline-none mr-3 mb-3 text-white font-bold h-10 w-10 rounded-full"
                  onClick={() => defaultBackgroundChanges()}
                >
                  🗑️
                </button>

                <button
                  className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 bg-black hover:bg-gray-900 focus:outline-none mb-5 text-white font-bold h-10 w-10 rounded-full"
                  onClick={() => getRandomBackground()}
                >
                  🔀
                </button>

                <div className="flex flex-row space-x-5 mt-3">
                  <div>
                    <h1 className="font-nimbus text-md font-bold">Rotate</h1>
                    <Switch checked={rotate} onChange={handleRotate} />
                  </div>

                  <div>
                    <h1 className="font-nimbus text-md font-bold">Grid</h1>
                    <Switch checked={grid} onChange={handleGrid} />
                  </div>

                  <div>
                    <h1 className="font-nimbus text-md font-bold">Stars</h1>
                    <Switch checked={stars} onChange={handleStars} />
                  </div>

                  <div>
                    <h1 className="font-nimbus text-md font-bold">Box</h1>
                    <Switch
                      checked={environment}
                      onChange={handleEnvironment}
                    />
                  </div>
                </div>

                <div className="mt-7">
                  <h1 className="font-nimbus text-md font-bold">Sun</h1>
                  <Switch checked={sky} onChange={handleSky} />

                  <div className="ml-2 mt-3 flex flex-row flex-wrap space-x-10">
                    <div className="w-10">
                      <h1 className="font-nimbus text-sm font-bold">X</h1>
                      <Slider
                        valueLabelDisplay="auto"
                        min={-50}
                        max={50}
                        step={1}
                        value={xPos}
                        onChange={handleXPos}
                      />
                    </div>

                    <div className="w-10">
                      <h1 className="font-nimbus text-sm font-bold">Y</h1>
                      <Slider
                        valueLabelDisplay="auto"
                        min={-5}
                        max={10}
                        step={1}
                        value={yPos}
                        onChange={handleYPos}
                      />
                    </div>

                    <div className="w-10">
                      <h1 className="font-nimbus text-sm font-bold">Z</h1>
                      <Slider
                        valueLabelDisplay="auto"
                        min={0}
                        max={200}
                        step={1}
                        value={zPos}
                        onChange={handleZPos}
                      />
                    </div>

                    <div className="w-10">
                      <h1 className="font-nimbus text-sm font-bold">MieG</h1>
                      <Slider
                        valueLabelDisplay="auto"
                        min={0}
                        max={1}
                        step={0.001}
                        value={skyMieDirectionalG}
                        onChange={handleSkyMieDirectionalG}
                      />
                    </div>
                  </div>

                  <div className="ml-2 mt-3 flex flex-row flex-wrap space-x-10">
                    <div className="w-10">
                      <h1 className="font-nimbus text-sm font-bold">MieC</h1>
                      <Slider
                        valueLabelDisplay="auto"
                        min={0}
                        max={0.1}
                        step={0.001}
                        value={skyMieCoefficent}
                        onChange={handleSkyMieCoefficient}
                      />
                    </div>

                    <div className="w-10">
                      <h1 className="font-nimbus text-sm font-bold">Ray</h1>
                      <Slider
                        valueLabelDisplay="auto"
                        min={0}
                        max={10}
                        step={0.5}
                        value={skyRayleigh}
                        onChange={handleSkyRayleigh}
                      />
                    </div>

                    <div className="w-10">
                      <h1 className="font-nimbus text-sm font-bold">Turb</h1>
                      <Slider
                        valueLabelDisplay="auto"
                        min={0}
                        max={10}
                        step={0.5}
                        value={skyTurbidity}
                        onChange={handleSkyTurbidity}
                      />
                    </div>
                  </div>
                </div>

                <div className="ml-2 mt-10 ml-2">
                  <div>
                    <h1 className="font-nimbus text-md font-bold">Ground</h1>
                    <Switch checked={ground} onChange={handleGround} />
                  </div>

                  <div className="mt-3">
                    <h1 className="font-nimbus text-md font-bold">
                      Ground Color
                    </h1>
                    <Picker />
                  </div>
                </div>

                {/* <div className="ml-2 mt-10">
                  <h1 className="font-nimbus text-md font-bold mt-5">
                    Chromatic
                  </h1>
                  <Switch checked={chromatic} onChange={handleChromatic} />

                  <div className="mt-5">
                    <h1 className="font-nimbus text-sm font-bold">X offset</h1>
                    <Slider
                      valueLabelDisplay="auto"
                      min={0}
                      max={0.4}
                      step={0.01}
                      value={chromaticX}
                      onChange={setChromaticXValue}
                    />

                    <h1 className="font-nimbus text-md font-bold">Y offset</h1>
                    <Slider
                      valueLabelDisplay="auto"
                      min={0}
                      max={0.4}
                      step={0.001}
                      value={chromaticY}
                      onChange={setChromaticYValue}
                    />
                  </div>
                </div> */}

                <div className="ml-2 mt-10">
                  <h1 className="font-nimbus text-md font-bold">Pixelation</h1>
                  <Switch checked={pixelation} onChange={handlePixelation} />

                  <div className="mt-5">
                    <h1 className="font-nimbus text-sm font-bold">
                      Pixel Granulation
                    </h1>
                    <Slider
                      valueLabelDisplay="auto"
                      min={30}
                      max={50}
                      step={1}
                      value={pixelationValue}
                      onChange={handlePixelationValue}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="absolute z-20 top-16 right-3">
        <button
          className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 bg-black hover:bg-gray-900 focus:outline-none text-white font-bold h-10 w-32 rounded-full"
          onClick={() => handleSettings("body")}
        >
          <span>Body</span>
        </button>
      </div>

      {showBodySettings === true ? (
        <div className="absolute z-20 top-24 right-3 w-auto bg-gray-100 rounded-lg mt-5 mr-2 overflow-auto h-5/6 max-w-lg">
          <div className="m-5">
            <h1 className="font-nimbus text-xl text-left">Body Settings</h1>

            <div className="mt-5">
              <button
                className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 bg-black hover:bg-gray-900 focus:outline-none mr-3 mb-3 text-white font-bold h-10 w-10 rounded-full"
                onClick={() => defaultPoseSettings()}
              >
                🗑️
              </button>

              <button
                className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 bg-black hover:bg-gray-900 focus:outline-none mb-5 text-white font-bold h-10 w-10 rounded-full"
                onClick={() => getRandomPose()}
              >
                🔀
              </button>
            </div>

            <div className="flex">
              <div className="mt-3 w-48">
                <h1 className="font-nimbus text-sm">Left Upper Arm</h1>
                <h1 className="font-nimbus text-sm mt-2">X</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={-2}
                  max={2}
                  step={0.005}
                  value={lArmPosX}
                  onChange={handleLArmPosX}
                />

                <h1 className="font-nimbus text-sm font-bold">Y</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={-1.4}
                  max={2}
                  step={0.005}
                  value={lArmPosY}
                  onChange={handleLArmPosY}
                />

                <h1 className="font-nimbus text-sm font-bold">Z</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={5}
                  max={7.6}
                  step={0.005}
                  value={lArmPosZ}
                  onChange={handleLArmPosZ}
                />

                <h1 className="font-nimbus text-sm mt-5">Left Lower Arm</h1>
                <h1 className="font-nimbus text-sm mt-2">X</h1>

                <Slider
                  valueLabelDisplay="auto"
                  min={-0.96}
                  max={2}
                  step={0.005}
                  value={lHandPosX}
                  onChange={handleLHandPosX}
                />

                <h1 className="font-nimbus text-sm">Y</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={-2}
                  max={0.4}
                  step={0.005}
                  value={lHandPosY}
                  onChange={handleLHandPosY}
                />

                <h1 className="font-nimbus text-sm">Z</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={6.5}
                  max={9.8}
                  step={0.005}
                  value={lHandPosZ}
                  onChange={handleLHandPosZ}
                />

                <h1 className="font-nimbus text-sm mt-5">Right Upper Arm</h1>
                <h1 className="font-nimbus text-sm mt-2">X</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={-1.2}
                  max={1.4}
                  step={0.005}
                  value={rArmPosX}
                  onChange={handleRArmPosX}
                />

                <h1 className="font-nimbus text-sm">Y</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={-1.2}
                  max={1.4}
                  step={0.005}
                  value={rArmPosY}
                  onChange={handleRArmPosY}
                />

                <h1 className="font-nimbus text-sm">Z</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={-1.2}
                  max={1.4}
                  step={0.005}
                  value={rArmPosZ}
                  onChange={handleRArmPosZ}
                />

                <h1 className="font-nimbus text-sm mt-5">Right Lower Arm</h1>
                <h1 className="font-nimbus text-sm mt-2">X</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={0}
                  max={2}
                  step={0.005}
                  value={rHandPosX}
                  onChange={handleRHandPosX}
                />

                <h1 className="font-nimbus text-sm">Y</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={-1.2}
                  max={1.4}
                  step={0.005}
                  value={rHandPosY}
                  onChange={handleRHandPosY}
                />

                <h1 className="font-nimbus text-sm">Z</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={-1.2}
                  max={1.4}
                  step={0.005}
                  value={rHandPosZ}
                  onChange={handleRHandPosZ}
                />

                <button
                  className="font-nimbus text-md hover:text-gray-500 mt-4"
                  onClick={downloadPose}
                >
                  Download Pose
                </button>

                <div className="mt-5 mb-8 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 bg-black hover:bg-gray-900 focus:outline-none text-white font-bold h-10 w-32 rounded-full">
                  <div {...getRootProps({ style })}>
                    <input {...getInputProps()} />
                    <h1 className="text-md font-bold">
                      Drag and drop pose file{" "}
                    </h1>
                  </div>
                </div>
              </div>

              <div className="mt-3 ml-5 mr-5 w-48">
                <h1 className="font-nimbus text-sm">Left Upper Leg</h1>

                <h1 className="font-nimbus text-sm mt-2">X</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={-2}
                  max={2}
                  step={0.005}
                  value={leftUpperLegX}
                  onChange={handleLUpperLegPosX}
                />

                <h1 className="font-nimbus text-sm">Y</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={-1}
                  max={1}
                  step={0.005}
                  value={leftUpperLegY}
                  onChange={handleLUpperLegPosY}
                />

                <h1 className="font-nimbus text-sm">Z</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={-1}
                  max={1}
                  step={0.005}
                  value={leftUpperLegZ}
                  onChange={handleLUpperLegPosZ}
                />

                <h1 className="font-nimbus text-sm mt-5">Left Lower Leg</h1>

                <h1 className="font-nimbus text-sm mt-2">X</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={-2}
                  max={1}
                  step={0.005}
                  value={leftLowerLegX}
                  onChange={handleLLowerLegPosX}
                />

                <h1 className="font-nimbus text-sm">Y</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={-1}
                  max={1}
                  step={0.005}
                  value={leftLowerLegY}
                  onChange={handleLLowerLegPosY}
                />

                <h1 className="font-nimbus text-sm">Z</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={-1}
                  max={1}
                  step={0.005}
                  value={leftLowerLegZ}
                  onChange={handleLLowerLegPosZ}
                />

                <h1 className="font-nimbus text-sm mt-5">Right Upper Leg</h1>

                <h1 className="font-nimbus text-sm mt-2">X</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={-1}
                  max={1}
                  step={0.005}
                  value={rightUpperLegX}
                  onChange={handleRUpperLegPosX}
                />

                <h1 className="font-nimbus text-sm">Y</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={-1}
                  max={1}
                  step={0.005}
                  value={rightUpperLegY}
                  onChange={handleRUpperLegPosY}
                />

                <h1 className="font-nimbus text-sm">Z</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={-1}
                  max={1}
                  step={0.005}
                  value={rightUpperLegZ}
                  onChange={handleRUpperLegPosZ}
                />

                <h1 className="font-nimbus text-sm mt-5">Right Lower Leg</h1>
                <h1 className="font-nimbus text-sm mt-2">X</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={-2}
                  max={1}
                  step={0.001}
                  value={rightLowerLegX}
                  onChange={handleRLowerLegPosX}
                />

                <h1 className="font-nimbus text-sm">Y</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={-1}
                  max={0}
                  step={0.001}
                  value={rightLowerLegY}
                  onChange={handleRLowerLegPosY}
                />

                <h1 className="font-nimbus text-sm">Z</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={-1}
                  max={1}
                  step={0.001}
                  value={rightLowerLegZ}
                  onChange={handleRLowerLegPosZ}
                />
              </div>

              <div className="mt-3">
                <h1 className="font-nimbus text-sm">Spine</h1>
                <h1 className="font-nimbus text-sm mt-2">X</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={-1}
                  max={1}
                  step={0.001}
                  value={spineX}
                  onChange={handleSpineX}
                />

                <h1 className="font-nimbus text-sm">Y</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={-1}
                  max={1}
                  step={0.001}
                  value={spineY}
                  onChange={handleSpineY}
                />

                <h1 className="font-nimbus text-sm">Z</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={-1}
                  max={1}
                  step={0.001}
                  value={spineZ}
                  onChange={handleSpineZ}
                />

                <h1 className="font-nimbus text-sm mt-5">Hip</h1>
                <h1 className="font-nimbus text-sm mt-2">X</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={-1}
                  max={1}
                  step={0.001}
                  value={hipX}
                  onChange={handleHipX}
                />

                <h1 className="font-nimbus text-sm">Y</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={-1}
                  max={1}
                  step={0.001}
                  value={hipY}
                  onChange={handleHipY}
                />

                <h1 className="font-nimbus text-sm">Y</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={-1}
                  max={1}
                  step={0.001}
                  value={hipZ}
                  onChange={handleHipZ}
                />

                <h1 className="font-nimbus text-sm mt-5">Head</h1>
                <h1 className="font-nimbus text-sm mt-2">X</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={-0.7}
                  max={1}
                  step={0.001}
                  value={headX}
                  onChange={handleHeadX}
                />

                <h1 className="font-nimbus text-sm"> Y</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={-1}
                  max={1}
                  step={0.001}
                  value={headY}
                  onChange={handleHeadY}
                />

                <h1 className="font-nimbus text-sm">Z</h1>
                <Slider
                  valueLabelDisplay="auto"
                  min={-0.4}
                  max={0.4}
                  step={0.001}
                  value={headZ}
                  onChange={handleHeadZ}
                />

                <h1 className="font-nimbus text-sm mt-5">Lock Head</h1>
                <Switch checked={head} onChange={handleHead} />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="absolute z-20 top-3 right-40">
        <button
          className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 bg-black hover:bg-gray-900 focus:outline-none text-white font-bold h-10 w-32 rounded-full"
          onClick={() => handleSettings("meebits")}
        >
          <span>Meebits</span>
        </button>
      </div>

      {showMeebitsSettings === true ? (
        <div className="absolute z-20 top-28 right-3 w-auto bg-gray-100 rounded-lg mr-2 overflow-auto max-w-lg">
          <div className="m-5">
            <h1 className="font-nimbus text-lg text-left mb-5">Your Meebits</h1>
            {meebits.map((file, index) => (
              <div className="flex mb-2" key={index}>
                <button
                  className="font-nimbus hover:text-gray-500"
                  onClick={() => changeVrm(index)}
                >
                  {file.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="absolute z-20 top-16 right-40">
        <button
          className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 bg-black hover:bg-gray-900 focus:outline-none text-white font-bold h-10 w-32 rounded-full"
          onClick={() => handleSettings("pose")}
        >
          <span>Preset Poses</span>
        </button>
      </div>

      {showPoseSettings === true ? (
        <div className="absolute z-20 top-28 right-3 w-auto bg-gray-100 rounded-lg mr-2 overflow-auto max-w-lg">
          <div className="m-5">
            <h1 className="font-nimbus text-lg text-left mb-3">
              Community Poses
            </h1>
            {communityPoses.map((action, index) => (
              <div className="flex mb-2" key={index}>
                <button
                  className="font-nimbus hover:text-gray-500"
                  onClick={() => handlePoseSettings(action.pose)}
                >
                  {action.poseName}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="absolute z-20 top-4 left-4">
        <Link to="/"> 
          <button
            className="transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 bg-black hover:bg-gray-900 focus:outline-none text-white font-bold h-10 w-32 rounded-full"
            onClick={() => window.location.reload()}
          >
            <span>Go Back Home</span>
          </button>
        </Link>
      </div>

      <Download pose={pose} />
    </div>
  );
}

export default Body;
