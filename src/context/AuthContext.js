// import React, { createContext, useState, useContext, useEffect } from "react";
// import { API_BASE_URL } from "../config";
// import jwtDecode from "jwt-decode";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [authChecked, setAuthChecked] = useState(false);

//   // Helper function to handle HTML responses
//   const handleHtmlResponse = async (response) => {
//     const textResponse = await response.text();
//     console.error("Server returned HTML:", textResponse.substring(0, 200));
    
//     const errorMatch = textResponse.match(/<title>(.*?)<\/title>/i) || 
//                       textResponse.match(/<h1>(.*?)<\/h1>/i);
//     return errorMatch ? errorMatch[1] : "Server error: Please check your API endpoint";
//   };

//   // Check if token is expired
//   const isTokenExpired = (token) => {
//     try {
//       const decoded = jwtDecode(token);
//       return decoded.exp * 1000 < Date.now();
//     } catch {
//       return true;
//     }
//   };

//   const decodeUser = (token) => {
//     try {
//       const decoded = jwtDecode(token);
//       return {
//         username: decoded.username || "User",
//         email: decoded.email || null,
//         userId: decoded.user_id || null,
//         exp: decoded.exp
//       };
//     } catch (err) {
//       console.error("❌ Token decode failed:", err);
//       return null;
//     }
//   };

//   useEffect(() => {
//     const initAuth = async () => {
//       const token = localStorage.getItem("access");
//       if (!token) {
//         setAuthChecked(true);
//         return;
//       }

//       if (isTokenExpired(token)) {
//         try {
//           await refreshToken();
//         } catch (error) {
//           logout();
//         }
//       } else {
//         setUser(decodeUser(token));
//       }
//       setAuthChecked(true);
//     };

//     initAuth();
//   }, []);

//   const login = async (email, password) => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${API_BASE_URL}login/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       // Handle HTML responses
//       const contentType = res.headers.get("content-type");
//       if (contentType?.includes("text/html")) {
//         const message = await handleHtmlResponse(res);
//         return { success: false, message };
//       }

//       const data = await res.json();

//       if (!res.ok) {
//         return { 
//           success: false, 
//           message: data.error || "Login failed" 
//         };
//       }

//       localStorage.setItem("access", data.access);
//       localStorage.setItem("refresh", data.refresh);

//       const decodedUser = decodeUser(data.access);
//       setUser(decodedUser);

//       return { success: true, user: decodedUser };
//     } catch (error) {
//       console.error("❌ Login error:", error);
//       return { 
//         success: false, 
//         message: error.message || "Login error" 
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (email, password) => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${API_BASE_URL}register/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       // Handle HTML responses
//       const contentType = res.headers.get("content-type");
//       if (contentType?.includes("text/html")) {
//         const message = await handleHtmlResponse(res);
//         return { success: false, message };
//       }

//       const data = await res.json();

//       if (!res.ok) {
//         return { 
//           success: false, 
//           message: data.error || "Registration failed" 
//         };
//       }

//       return { success: true, data };
//     } catch (error) {
//       console.error("❌ Register error:", error);
//       return { 
//         success: false, 
//         message: error.message || "Register error" 
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refreshToken = async () => {
//     try {
//       const refresh = localStorage.getItem("refresh");
//       if (!refresh) throw new Error("No refresh token");

//       const res = await fetch(`${API_BASE_URL}/token/refresh/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ refresh }),
//       });

//       if (!res.ok) throw new Error("Token refresh failed");

//       const data = await res.json();
//       localStorage.setItem("access", data.access);
      
//       const decodedUser = decodeUser(data.access);
//       setUser(decodedUser);
      
//       return data.access;
//     } catch (error) {
//       console.error("❌ Token refresh failed:", error);
//       logout();
//       throw error;
//     }
//   };

//   const checkAuth = async () => {
//     const token = localStorage.getItem("access");
//     if (!token) return false;

//     try {
//       if (isTokenExpired(token)) {
//         await refreshToken();
//         return true;
//       }
      
//       const decodedUser = decodeUser(token);
//       setUser(decodedUser);
//       return true;
//     } catch (error) {
//       console.error("❌ Auth check failed:", error);
//       return false;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("access");
//     localStorage.removeItem("refresh");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ 
//       user, 
//       loading,
//       authChecked,
//       login, 
//       register, 
//       logout,
//       refreshToken,
//       checkAuth
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);


import React, { createContext, useState, useContext, useEffect } from "react";
import { API_BASE_URL } from "../config";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Helper function to handle HTML responses
  const handleHtmlResponse = async (response) => {
    const textResponse = await response.text();
    console.error("Server returned HTML:", textResponse.substring(0, 200));

    const errorMatch =
      textResponse.match(/<title>(.*?)<\/title>/i) ||
      textResponse.match(/<h1>(.*?)<\/h1>/i);
    return errorMatch
      ? errorMatch[1]
      : "Server error: Please check your API endpoint";
  };

  // Check if token is expired
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  const decodeUser = (token) => {
    try {
      const decoded = jwtDecode(token);
      return {
        username: decoded.username || "User",
        email: decoded.email || null,
        userId: decoded.user_id || null,
        exp: decoded.exp,
      };
    } catch (err) {
      console.error("❌ Token decode failed:", err);
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        setAuthChecked(true);
        return;
      }

      if (isTokenExpired(token)) {
        try {
          await refreshToken();
        } catch (error) {
          logout();
        }
      } else {
        setUser(decodeUser(token));
      }
      setAuthChecked(true);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Handle HTML responses
      const contentType = res.headers.get("content-type");
      if (contentType?.includes("text/html")) {
        const message = await handleHtmlResponse(res);
        return { success: false, message };
      }

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data.error || "Login failed",
        };
      }

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      const decodedUser = decodeUser(data.access);
      setUser(decodedUser);

      return { success: true, user: decodedUser };
    } catch (error) {
      console.error("❌ Login error:", error);
      return {
        success: false,
        message: error.message || "Login error",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Handle HTML responses
      const contentType = res.headers.get("content-type");
      if (contentType?.includes("text/html")) {
        const message = await handleHtmlResponse(res);
        return { success: false, message };
      }

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data.error || "Registration failed",
        };
      }

      return { success: true, data };
    } catch (error) {
      console.error("❌ Register error:", error);
      return {
        success: false,
        message: error.message || "Register error",
      };
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const refresh = localStorage.getItem("refresh");
      if (!refresh) throw new Error("No refresh token");

      const res = await fetch(`${API_BASE_URL}refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });

      if (!res.ok) throw new Error("Token refresh failed");

      const data = await res.json();
      localStorage.setItem("access", data.access);

      const decodedUser = decodeUser(data.access);
      setUser(decodedUser);

      return data.access;
    } catch (error) {
      console.error("❌ Token refresh failed:", error);
      logout();
      throw error;
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem("access");
    if (!token) return false;

    try {
      if (isTokenExpired(token)) {
        await refreshToken();
        return true;
      }

      const decodedUser = decodeUser(token);
      setUser(decodedUser);
      return true;
    } catch (error) {
      console.error("❌ Auth check failed:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authChecked,
        login,
        register,
        logout,
        refreshToken,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
