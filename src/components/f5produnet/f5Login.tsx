import { useState } from "react";
import {  User, Lock } from "lucide-react";
import { motion } from "framer-motion";
import LoadingProdubanco from "../general/Loader";
import { div } from "framer-motion/client";

interface ContentF5Props {
  onhandleSubmit: (eUser: string, password: string) => void;
  onisLoading: boolean;
}

const f5Login: React.FC<ContentF5Props> = ({ onhandleSubmit, onisLoading }) => {
  const [eUser, setEUser] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center rounded-2xl justify-center">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-[400px] h-[300px] rounded-3xl p-4 overflow-hidden bg-white shadow-2xl">
          <div className="space-y-3">
            <div className="text-2xl font-bold text-center">F5 ProduNet</div>
            <div className="text-center">
              Ingrese sus credenciales para acceder
            </div>
          </div>
          {!onisLoading ? (
            <div className="mt-4 text-center">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onhandleSubmit(eUser, password);
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      id="eUser"
                      value={eUser}
                      onChange={(e) => setEUser(e.target.value)}
                      required
                      className="pl-10 rounded-2xl border border-green-600 py-2"
                      placeholder="Ingrese su Usuario"
                    />
                    <User className="absolute left-[85px] top-2.5 h-5 w-5 text-black" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 py-2 rounded-2xl border border-green-600"
                      placeholder="Ingrese su Password"
                    />
                    <Lock className="absolute left-[85px] top-2.5 h-5 w-5 text-black" />
                  </div>
                </div>
                <button
                  type="submit"
                  className="h-[40px] w-[200px] bg-green-700 items-center rounded-lg justify-center text-white relative overflow-hidden group"
                >
                  <span className="relative z-10">Consultar Nodo</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="mt-[70px] flex justify-center items-center">
                          <LoadingProdubanco />
          </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default f5Login;
