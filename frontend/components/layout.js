"use client";
import { useRouter } from "next/router";
import { useState, useEffect, createContext } from "react";
import { API_BASE_URL } from "../components/config";

export const CategoryContext = createContext();

const tools = [
  { title: "Split PDF", desc: "Separate one page or multiple pages from a PDF.", icon: "\u2702\uFE0F", category: "Organize PDF", path: "/split_pdf" },
  { title: "Merge PDF", desc: "Combine multiple PDFs into one file.", icon: "\u{1F517}", category: "Organize PDF", path: "/merge_pdf" },
  { title: "Compress PDF", desc: "Reduce PDF file size while maintaining quality.", icon: "\u{1F5DC}\uFE0F", category: "Optimize PDF", path: "/compress_pdf" },
  { title: "Add Watermark", desc: "Add text or image watermark to your PDF.", icon: "\u{1F4A7}", category: "Organize PDF", path: "/pdf_add_watermark" },
  { title: "Remove Pages", desc: "Delete specific pages from your PDF document.", icon: "\u{1F5D1}\uFE0F", category: "Organize PDF", path: "/remove_pages" },
  { title: "Edit PDF", desc: "Modify text, images, and other elements in your PDF.", icon: "\u{1F4DD}", category: "Organize PDF", path: "/edit_pdf" },
  { title: "Unlock PDF", desc: "Unlock password-protected PDFs.", icon: "\u{1F513}", category: "Secure PDF", path: "/unlock_pdf" },
  {title: "Rotate PDF", desc: "Rotate PDF pages to fix orientation.", icon: "\u{1F504}", category: "Organize PDF", path: "/rotate_pdf"},
  {title: "Repair PDF", desc: "Repair corrupted or damaged PDFs.", icon: "\u{1F527}", category: "Optimize PDF", path: "/repair_pdf"},
  // Convert FROM PDF tools
  { title: "Convert to JPG", desc: "Convert PDF pages into JPG images.", icon: "\u{1F5BC}\uFE0F", category: "Convert PDF", path: "/pdf_to_jpg" },
  { title: "Convert to PNG", desc: "Convert PDF pages into PNG images.", icon: "\u{1F3A8}", category: "Convert PDF", path: "/pdf_to_png" },
  { title: "Convert to PowerPoint", desc: "Turn your PDFs into PowerPoint slides.", icon: "\u{1F4CA}", category: "Convert PDF", path: "/pdf_to_ppt" },
  { title: "Convert to Word", desc: "Transform PDFs into editable Word documents.", icon: "\u{1F4DD}", category: "Convert PDF", path: "/pdf_to_word" },
  { title: "Convert to Excel", desc: "Change PDFs into Excel spreadsheets.", icon: "\u{1F4C8}", category: "Convert PDF", path: "/pdf_to_excel" },
  { title: "Convert to HTML", desc: "Transform PDFs into HTML documents.", icon: "\u{1F310}", category: "Convert PDF", path: "/pdf_to_html" },
  { title: "Convert to PDF/A", desc: "Convert PDF to PDF/A format for long-term archiving.", icon: "\u{1F4DA}", category: "Convert PDF", path: "/pdf_to_pdfa" },
  { title: "Add Page Numbers", desc: "Add page numbers to PDF documents.", icon: "\u{1F517}", category: "Organize PDF", path: "/pdf_add_page_numbers" },
  { title: "Edit PDF", desc: "Add page numbers to PDF documents.", icon: "\u{1F517}", category: "Organize PDF", path: "/edit_pdf" },
  
  { title: "Scan PDF", desc: "Scan documents and convert them to PDF format.", icon: "\u{1F5BC}\uFE0F", category: "Convert PDF", path: "/scan_pdf" },
  // Convert TO PDF tools (reverse conversions)
  { title: "JPG to PDF", desc: "Convert JPG images into a single PDF document.", icon: "\u{1F4C4}", category: "Convert to PDF", path: "/jpg_to_pdf" },
  { title: "PNG to PDF", desc: "Convert PNG images into a single PDF document.", icon: "\u{1F4CB}", category: "Convert to PDF", path: "/png_to_pdf" },
  { title: "PowerPoint to PDF", desc: "Convert PowerPoint presentations to PDF format.", icon: "\u{1F4D2}", category: "Convert to PDF", path: "/ppt_to_pdf" },
  { title: "Word to PDF", desc: "Convert Word documents to PDF format.", icon: "\u{1F4DC}", category: "Convert to PDF", path: "/word_to_pdf" },
  { title: "Excel to PDF", desc: "Convert Excel spreadsheets to PDF format.", icon: "\u{1F4CA}", category: "Convert to PDF", path: "/excel_to_pdf" },
  { title: "HTML to PDF", desc: "Convert HTML documents to PDF format.", icon: "\u{1F517}", category: "Convert to PDF", path: "/html_to_pdf" },  
  { title: "Add Signature", desc: "Add a signature to a PDF file.", icon: "\u{1F512}", category: "Secure PDF", path: "/sign_pdf" },
  { title: "Secure PDF", desc: "Protect your PDF with a password.", icon: "\u{1F512}", category: "Secure PDF", path: "/pdf_secure" },
];

const categories = ["All", "Organize PDF", "Convert PDF", "Convert to PDF", "Optimize PDF", "Secure PDF"];

export default function Layout({ children }) {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // check on first render
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://pdfville.com:5000";

const sidebarTools = [
  { name: "Home", path: "/", icon: "\u{1F3E0}" },        
  { name: "Split", path: "/split_pdf", icon: "\u2702\uFE0F" }, 
  { name: "Merge", path: "/merge_pdf", icon: "\u{1F517}" }, 
  { name: "Compress", path: "/compress_pdf", icon: "\u{1F5DC}\uFE0F" }, 
  { name: "Edit", path: "/edit_pdf", icon: "\u{1F4DD}" },
  { name: "Convert", path: "/convert_pdf", icon: "\u{1F504}" }, 
  { name: "To PDF", path: "/convert_to_pdf", icon: "\u{1F4C4}" },
  { name: "Secure", path: "/pdf_secure", icon: "\u{1F512}" },
];

  useEffect(() => {
    checkAuthStatus();
  }, []);

      // ...
    const checkAuthStatus = async () => {
      if (typeof window === 'undefined') return;
      
      const token = localStorage.getItem("access_token");
      
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/profile`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            // Extract custom:is_premium_ attribute
            const isPremium = userData.attributes && userData.attributes['custom:is_premium_'] === 'true';
            setUser({ ...userData, isPremium }); // Add isPremium to user state
            setIsAuthenticated(true);
          } else {
            localStorage.clear();
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.clear();
          setIsAuthenticated(false);
        }
      }
      
      setLoading(false);
    };
    // ...
    // Add this component outside your main Layout component
const MobileMenu = ({ 
  categories, 
  tools, 
  setMobileMenuOpen, 
  handleNavigation, 
  router, 
  isAuthenticated, 
  user, 
  handleAuthButton 
}) => {
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "60px",
        right: "0",
        left: "0",
        bottom: "0",
        background: "#fff",
        padding: "1rem",
        zIndex: 2000,
        overflowY: "auto",
        height: "calc(100vh - 60px)",
      }}
    >
      {/* Close button */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
        <button
          onClick={() => setMobileMenuOpen(false)}
          style={{
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
        >
          Ã—
        </button>
      </div>

      {/* Categories with expandable submenus */}
      {categories.map((category) => {
        const categoryTools = category === "All" 
          ? tools 
          : tools.filter((t) => t.category === category);
        
        return (
          <div key={category} style={{ marginBottom: "1rem" }}>
            <div
              onClick={() => toggleCategory(category)}
              style={{
                padding: "12px 0",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #f0f0f0",
                fontWeight: "600",
              }}
            >
              <span>{category}</span>
              <span>  {expandedCategories[category] ? String.fromCharCode(0x25BC) : String.fromCharCode(0x25BA)}</span>
            </div>
            
            {expandedCategories[category] && (
              <div style={{ paddingLeft: "1rem" }}>
                {categoryTools.map((tool) => (
                  <div
                    key={tool.title}
                    onClick={() => {
                      handleNavigation(tool.path, tool);
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      padding: "12px 0",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      borderBottom: "1px solid #f8f8f8",
                    }}
                  >
                    <span style={{ fontSize: "1.2rem" }}>{tool.icon}</span>
                    <div>
                      <div style={{ fontWeight: "500" }}>{tool.title}</div>
                      <div style={{ fontSize: "0.8rem", color: "#666", marginTop: "2px" }}>
                        {tool.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      
      <hr style={{ margin: "1rem 0" }} />
      
      {/* Pricing link */}
      <div
        onClick={() => {
          router.push("/pricing");
          setMobileMenuOpen(false);
        }}
        style={{ 
          padding: "12px 0", 
          cursor: "pointer",
          fontWeight: "600",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        Pricing
      </div>
      
      {/* User info if authenticated */}
      {isAuthenticated && user && (
        <div style={{ 
          padding: "12px 0", 
          fontSize: "0.9rem",
          borderBottom: "1px solid #f0f0f0",
        }}>
          Welcome, {user.email}{" "}
          {user.isPremium ? (
            <span style={{ color: "goldenrod", fontWeight: "bold" }}>(Premium)</span>
          ) : (
            <span style={{ color: "#666" }}>(Free)</span>
          )}
        </div>
      )}
      
      {/* Auth button */}
      <button
        onClick={() => {
          handleAuthButton();
          setMobileMenuOpen(false);
        }}
        style={{
          marginTop: "1rem",
          width: "100%",
          background: isAuthenticated
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : "#000",
          color: "#fff",
          border: "none",
          padding: "0.75rem",
          borderRadius: "6px",
          fontSize: "1rem",
          fontWeight: "500",
          marginLeft: "-5rem"
        }}
      >
        {isAuthenticated ? "Logout" : "Login / Signup"}
      </button>
    </div>
  );
};
    

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        await fetch(`${API_BASE_URL}/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.clear();
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  

  const handleNavigation = (path, tool = null) => {
    console.log("Layout handleNavigation called with:", { path, tool });
    
    // Navigate directly to the path
    router.push(path);
    
    setIsOpen(false);
    setActiveSubmenu(null);
  };
  
  // Function to handle footer navigation with scroll to top
  const handleFooterNavigation = (path) => {
    // Navigate to the path first
    router.push(path).then(() => {
      // Use setTimeout to ensure the page has rendered before scrolling
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }, 100);
    });
  };

  // Function to handle opening legal pages in new tabs
  const handleLegalPageNavigation = (path) => {
    const baseUrl = window.location.origin;
    window.open(`${baseUrl}${path}`, '_blank', 'noopener,noreferrer');
  };

  const handleAuthButton = () => {
    console.log("Auth button clicked, isAuthenticated:", isAuthenticated);
    if (isAuthenticated) {
      handleLogout();
    } else {
      router.push('/login');
    }
  };


  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        backgroundColor: "#f4f4f4" 
      }}>
        <div style={{ fontSize: "1.2rem", color: "#333" }}>Loading...</div>
      </div>
    );
  }

  return (
    <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory, tools, isAuthenticated, user, handleNavigation }}>
      <div style={{ display: "flex", minHeight: "100vh", width: "100%", backgroundColor: "#fff", color: "#000" }}>
        
        {/* Sidebar - only show if authenticated */}
        {isAuthenticated && (
          <nav
            style={{
              width: isOpen ? "80px" : "0px",
              background: "#333333",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "20px",
              transition: "width 0.3s ease",
              overflow: "hidden",
              position: "fixed",
              height: "100%",
              zIndex: 1000,
            }}
          >
            {sidebarTools.map((tool) => (
              <div
                key={tool.name}
                onClick={() => handleNavigation(tool.path)}
                style={{
                  marginBottom: "20px",
                  cursor: "pointer",
                  padding: "10px",
                  borderRadius: "10px",
                  background: router.pathname === tool.path ? "#ffffff" : "transparent",
                  color: router.pathname === tool.path ? "#333333" : "#ffffff",
                  fontSize: "28px",
                  textAlign: "center",
                  transition: "0.2s ease",
                }}
              >
                {tool.icon}
              </div>
            ))}
          </nav>
        )}

        {/* Toggle Sidebar Button - only show if authenticated */}
        {isAuthenticated && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              position: "fixed",
              top: "20px",
              left: isOpen ? "90px" : "10px",
              background: "#333333",
              color: "#ffffff",
              border: "none",
              padding: "8px 12px",
              cursor: "pointer",
              borderRadius: "6px",
              zIndex: 1100,
              transition: "left 0.3s ease",
            }}
          >
            {isOpen ? "?" : "?"}
          </button>
        )}

        {/* Main Content */}
        <main
          style={{
            flex: 1,
            marginLeft: isAuthenticated && isOpen ? "80px" : "0px",
            transition: "margin-left 0.3s ease",
            width: "100%",
            minHeight: "100vh",
          }}
        >
          {/* Header - Fixed with proper z-index */}
          <header
            style={{
              width: "100%",
              background: "#fff",
              borderBottom: "1px solid #e0e0e0",
              padding: isMobile ? "1rem" : "1rem 2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "sticky",
              top: 0,
              zIndex: 900, // Reduced to prevent overlap issues
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {/* Left Logo + Categories */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <div
                onClick={() => router.push("/")}
                style={{
                  fontWeight: "800",
                  fontSize: isMobile ? "1.2rem" : "1.5rem",
                  cursor: "pointer",
                  color: "#808080",
                  letterSpacing: "1px",
                  marginLeft: isMobile ? "0" : "2rem",
                }}
              >
                PDFVILLE
              </div>

              {/* Categories (Desktop only) */}
              {!isMobile && router.pathname === "/" && (
                <nav style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  {categories.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedCategory(c)}
                      style={{
                        padding: "0.4rem 1rem",
                        fontSize: "0.9rem",
                        color: selectedCategory === c ? "#fff" : "#000",
                        background: selectedCategory === c ? "#000" : "transparent",
                        border: "1px solid #000",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </nav>
              )}
            </div>

            {/* Desktop Menu (Categories w/ submenu + Right buttons) */}
            {!isMobile && (
              <>
                {router.pathname !== "/" && (
                  <nav
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginLeft: "auto",
                      position: "relative",
                    }}
                  >
                    {categories.map((cat) => {
                      const categoryTools =
                        cat === "All" ? tools : tools.filter((t) => t.category === cat);

                      return (
                        <div
                          key={cat}
                          style={{ position: "relative", cursor: "pointer" }}
                          onMouseEnter={() => setActiveSubmenu(cat)}
                          onMouseLeave={() => setActiveSubmenu(null)}
                        >
                          <div
                            style={{
                              fontSize: "1rem",
                              fontWeight: selectedCategory === cat ? "bold" : "normal",
                              borderBottom:
                                selectedCategory === cat
                                  ? "2px solid #000"
                                  : "2px solid transparent",
                              padding: "5px 10px",
                              transition: "0.2s ease",
                            }}
                            onClick={() => setSelectedCategory(cat)}
                          >
                            {cat}
                          </div>

                          {activeSubmenu === cat && (
                            <div
                              style={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                background: "#fff",
                                minWidth: "200px",
                                display: "flex",
                                flexDirection: "column",
                                borderRadius: "5px",
                                overflow: "hidden",
                                zIndex: 1000,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                border: "1px solid #e0e0e0",
                              }}
                            >
                              {categoryTools.map((tool) => (
                                <div
                                  key={tool.title}
                                  onClick={() => handleNavigation(tool.path, tool)}
                                  style={{
                                    padding: "18px 20px",
                                    cursor: "pointer",
                                    color: "#333",
                                    background: "transparent",
                                    transition: "0.2s ease",
                                    fontSize: "0.9rem",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                  }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = "#f5f5f5")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.background = "transparent")
                                  }
                                >
                                  <span>{tool.icon}</span>
                                  <span>{tool.title}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </nav>
                )}

                {/* Right Section */}
                <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "1rem", // Reduced gap from 1.25rem to 1rem
    position: "relative",
    marginRight: "2.5rem", // Added right margin to push content left
  }}
>
  <div
    style={{
      cursor: "pointer",
      fontSize: "1rem",
      padding: "5px 10px",
      transition: "0.2s ease",
      fontWeight: "500",
      marginLeft: "3rem", // Added left margin to push it further left
    }}
    onClick={() => router.push("/pricing")}
  >
    Pricing
  </div>

  {isAuthenticated && user && (
    <>
      <span style={{ color: "#ccc" }}>|</span>
      <div
        style={{
          color: "#666",
          fontSize: "0.9rem",
          padding: "5px 10px",
        }}
      >
        Welcome, {user.email}{" "}
        {user.isPremium ? "(Premium)" : "(Free)"}
      </div>
    </>
  )}

  <span style={{ color: "#ccc" }}>|</span>
  <button
    onClick={handleAuthButton}
    style={{
      background: isAuthenticated
        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        : "#000",
      color: "#fff",
      border: "none",
      padding: "0.5rem 1.2rem",
      borderRadius: "6px",
      fontSize: "0.9rem",
      cursor: "pointer",
      transition: "all 0.3s ease",
      minWidth: "120px",
      fontWeight: "500",
    }}
  >
    {isAuthenticated ? "Logout" : "Login / Signup"}
  </button>
  </div>
              </>
            )}

            {/* Mobile Hamburger Menu */}
{isMobile && (
  <div style={{ position: "relative" }}>
    <button
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      style={{
        fontSize: "1.5rem",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "5px",
        zIndex: 1000,
      }}
    >
      ?
    </button>

    {mobileMenuOpen && (
      <MobileMenu 
        categories={categories} 
        tools={tools} 
        setMobileMenuOpen={setMobileMenuOpen} 
        handleNavigation={handleNavigation}
        router={router}
        isAuthenticated={isAuthenticated}
        user={user}
        handleAuthButton={handleAuthButton}
      />
    )}
  </div>
)}
          </header>

          {/* Page content */}
          <div style={{ paddingTop: isMobile ? "0" : "0" }}>
            {children}
          </div>
          
          {/* Footer */}
          <footer style={{
            width: "100%",
            padding: "2rem 1rem",
            backgroundColor: "#1f2937",
            color: "#fff",
            marginTop: "auto"
          }}>
            <div style={{
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: isMobile ? "2rem" : "1rem"
            }}>
              {/* Product Column */}
              <div style={{ minWidth: isMobile ? "100%" : "150px" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem" }}>PRODUCT</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <div onClick={() => handleFooterNavigation("/")} style={{ cursor: "pointer", fontSize: "0.9rem" }}>Home</div>
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <div onClick={() => handleFooterNavigation("/features")} style={{ cursor: "pointer", fontSize: "0.9rem" }}>Features</div>
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <div onClick={() => handleFooterNavigation("/pricing")} style={{ cursor: "pointer", fontSize: "0.9rem" }}>Pricing</div>
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <div onClick={() => handleFooterNavigation("/tools")} style={{ cursor: "pointer", fontSize: "0.9rem" }}>Tools</div>
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <div onClick={() => handleFooterNavigation("/faq")} style={{ cursor: "pointer", fontSize: "0.9rem" }}>FAQ</div>
                  </li>
                </ul>
              </div>
              
              {/* Resources Column */}
              <div style={{ minWidth: isMobile ? "100%" : "150px" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem" }}>RESOURCES</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <div onClick={() => window.open("#", "_blank")} style={{ cursor: "pointer", fontSize: "0.9rem" }}>PDFVille Desktop</div>
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <div onClick={() => window.open("#", "_blank")} style={{ cursor: "pointer", fontSize: "0.9rem" }}>PDFVille Mobile</div>
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <div onClick={() => window.open("#", "_blank")} style={{ cursor: "pointer", fontSize: "0.9rem" }}>PDFVille Sign</div>
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <div onClick={() => window.open("#", "_blank")} style={{ cursor: "pointer", fontSize: "0.9rem" }}>PDFVille API</div>
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <div onClick={() => window.open("#", "_blank")} style={{ cursor: "pointer", fontSize: "0.9rem" }}>PDFVille IMG</div>
                  </li>
                </ul>
              </div>
              
              {/* Solutions Column */}
              <div style={{ minWidth: isMobile ? "100%" : "150px" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem" }}>SOLUTIONS</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <div onClick={() => handleFooterNavigation("/business")} style={{ cursor: "pointer", fontSize: "0.9rem" }}>Business</div>
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <div onClick={() => handleFooterNavigation("/education")} style={{ cursor: "pointer", fontSize: "0.9rem" }}>Education</div>
                  </li>
                </ul>
              </div>
              
              {/* Legal Column */}
              <div style={{ minWidth: isMobile ? "100%" : "150px" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem" }}>LEGAL</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <div onClick={() => handleLegalPageNavigation("/security")} style={{ cursor: "pointer", fontSize: "0.9rem" }}>Security</div>
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <div onClick={() => handleLegalPageNavigation("/privacy_policy")} style={{ cursor: "pointer", fontSize: "0.9rem" }}>Privacy policy</div>
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <div onClick={() => handleLegalPageNavigation("/terms")} style={{ cursor: "pointer", fontSize: "0.9rem" }}>Terms & conditions</div>
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <div onClick={() => handleLegalPageNavigation("/cookies")} style={{ cursor: "pointer", fontSize: "0.9rem" }}>Cookies</div>
                  </li>
                </ul>
              </div>
              
              {/* Company Column */}
              <div style={{ minWidth: isMobile ? "100%" : "150px" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem" }}>COMPANY</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <div onClick={() => handleFooterNavigation("/about")} style={{ cursor: "pointer", fontSize: "0.9rem" }}>About us</div>
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <div onClick={() => handleFooterNavigation("/contact")} style={{ cursor: "pointer", fontSize: "0.9rem" }}>Contact us</div>
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <div onClick={() => handleFooterNavigation("/blog")} style={{ cursor: "pointer", fontSize: "0.9rem" }}>Blog</div>
                  </li>
                  <li style={{ marginBottom: "0.5rem" }}>
                    <div onClick={() => handleFooterNavigation("/press")} style={{ cursor: "pointer", fontSize: "0.9rem" }}>Press</div>
                  </li>
                </ul>
              </div>
              
              {/* Download Links */}
              <div style={{ minWidth: isMobile ? "100%" : "200px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div onClick={() => window.open("#", "_blank")} style={{ cursor: "pointer" }}>
                     <img src="/google-play-badge.svg" alt="Get it on Google Play" style={{ height: "40px" }} />
                   </div>
                   <div onClick={() => window.open("#", "_blank")} style={{ cursor: "pointer" }}>
                     <img src="/app-store-badge.svg" alt="Download on the App Store" style={{ height: "40px" }} />
                   </div>
                   <div onClick={() => window.open("#", "_blank")} style={{ cursor: "pointer" }}>
                     <img src="/mac-app-store-badge.svg" alt="Download on the Mac App Store" style={{ height: "40px" }} />
                   </div>
                   <div onClick={() => window.open("#", "_blank")} style={{ cursor: "pointer" }}>
                     <img src="/microsoft-store-badge.svg" alt="Get it from Microsoft" style={{ height: "40px" }} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Section with Social Media and Copyright */}
            <div style={{
              borderTop: "1px solid #374151",
              marginTop: "2rem",
              paddingTop: "1.5rem",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "center" : "center",
              gap: isMobile ? "1rem" : "0",
              maxWidth: "1200px",
              margin: "0 auto"
            }}>
              {/* Social Media Links */}
              <div style={{ 
                display: "flex", 
                gap: "1.5rem", 
                alignItems: "center",
                marginBottom: isMobile ? "1rem" : "0"
              }}>
                <a href="https://www.youtube.com/@PDFVILLE" target="_blank" rel="noopener noreferrer" style={{ color: "#9ca3af", textDecoration: "none" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                </a>
                <a href="https://in.pinterest.com/pdfville/" target="_blank" rel="noopener noreferrer" style={{ color: "#9ca3af", textDecoration: "none" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/pdfville/" target="_blank" rel="noopener noreferrer" style={{ color: "#9ca3af", textDecoration: "none" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
              
              {/* Copyright */}
              <div style={{ fontSize: "0.9rem", color: "#9ca3af" }}>
                © PDFVille {new Date().getFullYear()} • Your PDF Editor
              </div>
            </div>
          </footer>
        </main>
      </div>
    </CategoryContext.Provider>
  );
}