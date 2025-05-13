"use client";

import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";

 const InteractiveCubeGame = () => {
  return (
    <div className="rounded-xl h-[450px] w-[270px] w-full bg-black relative">
      <Canvas shadows camera={{ position: [0, 6, 10] }}>
        <ambientLight intensity={0.5} />
        <directionalLight castShadow position={[5, 8, 5]} />
        <Physics gravity={[0, -9.8, 0]}>
          <ControlledCube />
          <FixedFloor />
        </Physics>
        <OrbitControls />
      </Canvas>
      <TouchControls />
    </div>
  );
}

// 🎮 Cube that Changes Shape & Color on Jump
function ControlledCube() {
  const cubeRef = useRef<any>(null);
  const [shape, setShape] = useState<"box" | "sphere" | "cylinder">("box");
  const [color, setColor] = useState("orange");

  const moveCube = (direction: string) => {
    if (!cubeRef.current) return;
    let { x, y, z } = cubeRef.current.translation();
    const moveSpeed = 0.5;

    switch (direction) {
      case "left": x -= moveSpeed; break;
      case "right": x += moveSpeed; break;
      case "forward": z -= moveSpeed; break;
      case "backward": z += moveSpeed; break;
      case "jump":
        if (y < 2.1) {
          cubeRef.current.applyImpulse(new Vector3(0, 15, 0), true);
          changeAppearance();
        }
        break;
    }
    cubeRef.current.setTranslation({ x, y, z });
  };

  // 🔥 Change Shape & Color on Jump
  const changeAppearance = () => {
    const shapes = ["box", "sphere", "cylinder"];
    const colors = ["red", "blue", "green", "purple", "yellow", "white"];

    setShape(shapes[Math.floor(Math.random() * shapes.length)] as any);
    setColor(colors[Math.floor(Math.random() * colors.length)]);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyMap: Record<string, string> = {
        ArrowLeft: "left", a: "left",
        ArrowRight: "right", d: "right",
        ArrowUp: "forward", w: "forward",
        ArrowDown: "backward", s: "backward",
        " ": "jump",
      };
      if (keyMap[event.key]) moveCube(keyMap[event.key]);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <RigidBody ref={cubeRef} restitution={0} friction={0.3} angularDamping={0.5}>
      <mesh castShadow>
        {shape === "box" && <boxGeometry args={[1.5, 1.5, 1.5]} />}
        {shape === "sphere" && <sphereGeometry args={[1, 32, 32]} />}
        {shape === "cylinder" && <cylinderGeometry args={[0.8, 0.8, 1.5, 32]} />}
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  );
}

// 🏞️ Fixed Floor with Shadows
function FixedFloor() {
  return (
    <RigidBody type="fixed">
      <mesh position={[0, -2, 0]} scale={[10, 0.5, 10]} receiveShadow>
        <boxGeometry />
        <meshStandardMaterial color="gray" />
      </mesh>
    </RigidBody>
  );
}

// 📱 Touchscreen Controls
function TouchControls() {
  const move = (dir: string) => {
    const event = new KeyboardEvent("keydown", { key: dir });
    window.dispatchEvent(event);
  };

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
      <button className="control-btn" onClick={() => move("ArrowUp")}>▲</button>
      <div className="flex gap-2">
        <button className="control-btn" onClick={() => move("ArrowLeft")}>◀</button>
        <button className="control-btn" onClick={() => move(" ")}>
          ⬆
        </button>
        <button className="control-btn" onClick={() => move("ArrowRight")}>▶</button>
      </div>
      <button className="control-btn" onClick={() => move("ArrowDown")}>▼</button>

      {/* Tailwind Styles */}
      <style>{`
        .control-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          font-size: 20px;
          padding: 10px 15px;
          border-radius: 5px;
          border: none;
          cursor: pointer;
          user-select: none;
          touch-action: manipulation;
        }
        .control-btn:active { background: rgba(255, 255, 255, 0.5); }
      `}</style>
    </div>
  );
}

export default InteractiveCubeGame;
