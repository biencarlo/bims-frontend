// components/LoadingPage.tsx
import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";

const LoadingPage: React.FC = () => {
  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <div
        className="bg-white rounded-xl p-10"
        style={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ProgressSpinner
            style={{ width: "100px", height: "100px" }}
            strokeWidth="7"
            animationDuration="0.4s"
          />
          <div
            style={{
              marginTop: "50px",
              fontWeight: "bold",
              fontSize: "20px",
              color: "#7F1D1D",
            }}
          >
            Loading... Please Wait
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
