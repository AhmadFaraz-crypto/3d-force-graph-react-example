import "./App.css";
import { gData } from "./data";
import React, { useRef, useCallback, useState } from "react";
import ForceGraph3D from "react-force-graph-3d";
import SpriteText from "three-spritetext";

export function App() {
  const fgRef = useRef();
  const [state, setState] = useState({
    nodeSize: 4,
    linkWidth: 1,
    linkLength: 3,
    linkOpacity: 0.5,
    nodeColor: "#73b72b",
  });

  const updateState = (values) => {
    setState((prev) => ({
      ...prev,
      ...values,
    }));
  };

  const onLinkLengthChange = (value) => {
    updateState({ linkLength: Number(value) });
    const linkForce = fgRef.current.d3Force("link");
    linkForce.distance(() => Number(value));
  };

  const handleClick = useCallback(
    (node) => {
      // Aim at node from outside it
      const distance = 180;
      const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

      fgRef.current.cameraPosition(
        {
          x: node.x * distRatio,
          y: node.y * distRatio,
          z: node.z * distRatio,
        }, // new position
        node, // lookAt ({ x, y, z })
        3000 // ms transition duration
      );
    },
    [fgRef]
  );
  const tooltipText = node => {
    return `<div class="chart-tooltip"><b>Name:</b> ${node.id}</div>`;
  };

  return (
    <div className="container">
      <div id="3d-graph">
        <ForceGraph3D
          ref={fgRef}
          graphData={gData}
          nodeRelSize={state.nodeSize}
          linkWidth={state.linkWidth}
          nodeLabel={tooltipText}
          linkOpacity={state.linkOpacity}
          dagLevelDistance={state.linkLength}
          onNodeClick={handleClick}
          nodeColor={function () {
            return state.nodeColor;
          }}
          linkThreeObjectExtend={true}
          nodeOpacity={8}
          linkThreeObject={(link) => {
            // extend link with text sprite
            const sprite = new SpriteText("");
            sprite.color = "lightgrey";
            sprite.textHeight = 5;
            return sprite;
          }}
          linkPositionUpdate={(sprite, { start, end }) => {
            const middlePos = Object.assign(
              ...["x", "y", "z"].map((c) => ({
                [c]: start[c] + (end[c] - start[c]) / 2, // calc middle point
              }))
            );

            // Position sprite
            Object.assign(sprite.position, middlePos);
          }}
        />
      </div>
      <ControlSettings
        state={state}
        updateState={updateState}
        onLinkLengthChange={onLinkLengthChange}
      />
    </div>
  );
}

function ControlSettings({ state, updateState, onLinkLengthChange }) {
  return (
    <div className="control-settings">
      <div className="control-setting-heading">
        <h3>Control settings</h3>
      </div>
      <div className="control-item">
        <label>Node size</label>
        <input
          type="range"
          value={state.nodeSize}
          min={0}
          max={6}
          onChange={(e) => updateState({ nodeSize: e.target.value })}
        />
      </div>
      <div className="control-item">
        <label>Link width</label>
        <input
          type="range"
          value={state.linkWidth}
          min={0}
          max={10}
          onChange={(e) => updateState({ linkWidth: Number(e.target.value) })}
        />
      </div>
      <div className="control-item">
        <label>Link length</label>
        <input
          type="range"
          value={state.linkLength}
          min={0}
          max={200}
          onChange={(e) => onLinkLengthChange(e.target.value)}
        />
      </div>
      <div className="control-item">
        <label>Link opacity</label>
        <input
          type="range"
          value={state.linkOpacity}
          min={0}
          max={1}
          step={0.1}
          onChange={(e) => updateState({ linkOpacity: e.target.value })}
        />
      </div>
      <div className="control-item">
        <label>Node color</label>
        <input
          type="color"
          value={state.nodeColor}
          onChange={(e) => updateState({ nodeColor: e.target.value })}
        />
      </div>
    </div>
  );
}
