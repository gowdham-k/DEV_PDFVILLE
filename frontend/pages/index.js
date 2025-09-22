"use client";
import { useContext } from "react";
import { CategoryContext } from "../components/layout";

export default function HomePage() {
  const { selectedCategory, tools, isAuthenticated, user, handleNavigation } = useContext(CategoryContext);

  const filteredTools =
    selectedCategory === "All" ? tools : tools.filter((t) => t.category === selectedCategory);

  return (
    <div style={{ 
      minHeight: "calc(100vh - 80px)", 
      backgroundColor: "#f4f4f4",
      color: "#000",
      paddingBottom: "80px" // Add space for fixed footer
    }}>
      {/* Hero Section */}
      <div style={{ 
        padding: "3rem 2rem", 
        maxWidth: "1200px", 
        margin: "0 auto",
        textAlign: "center"
      }}>
        <h1 style={{ 
          fontSize: "2.5rem", 
          fontWeight: "700", 
          marginBottom: "1rem",
          color: "#000",
          lineHeight: "1.2"
        }}>
          All the PDF tools you'll ever need, in one place
        </h1>
        
        <p style={{ 
          fontSize: "1.1rem", 
          color: "#666", 
          lineHeight: "1.6", 
          marginBottom: "2rem",
          maxWidth: "800px",
          margin: "0 auto 2rem auto"
        }}>
          Free, simple, and fast — merge, split, compress, convert, rotate, unlock, and watermark PDFs effortlessly. 
          Manage your documents with ease, whether you need to combine multiple files into one, extract specific pages, 
          reduce file size without losing quality, or convert PDFs to popular formats like Word, Excel, or JPG.
        </p>
      </div>

      {/* Tools Grid */}
      <div style={{ padding: "0 2rem 3rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
            justifyContent: "center",
          }}
        >
          {filteredTools.map((tool, i) => (
            <div
              key={i}
              onClick={() => {
                console.log("Tool clicked:", tool);
                handleNavigation(tool.path, tool);
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.08)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
              style={{
                background: "#fff",
                border: "1px solid #e0e0e0",
                borderRadius: "16px",
                padding: "2rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                opacity: 1,
                position: "relative",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
              }}
            >
              <div style={{ 
                fontSize: "2.5rem", 
                marginBottom: "1rem",
                textAlign: "center"
              }}>
                {tool.icon}
              </div>
              
              <h3 style={{ 
                fontSize: "1.3rem", 
                fontWeight: "600", 
                marginBottom: "0.8rem",
                color: "#000",
                textAlign: "center"
              }}>
                {tool.title}
              </h3>
              
              <p style={{ 
                fontSize: "1rem", 
                color: "#666",
                lineHeight: "1.5",
                textAlign: "center"
              }}>
                {tool.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}