import { useState, useMemo } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import {
  GranjaDTOModel,
  GranjasStatusText,
} from "../types/granjasTypes/granjasSA";
import ServicesTabContent from "../components/granjas/GranjasTabContent";
import { useGranjasSa } from "../hooks/granjas/useGranjasSa";
import ConfirmPopup from "../components/general/ConfirmPopup";

// Generar una lista de servicios mock
const generateMockServices = (count: number): GranjaDTOModel[] => {
  return Array.from({ length: count }, (_, i) => ({
    name: `WCF_Aplicacional_Service_${i + 1}`,
    code: `172.24.${Math.floor(i / 255)}.${i % 255}`,
    status: [0, 1, 2, 5][
      Math.floor(Math.random() * 4)
    ] as GranjaDTOModel["status"],
  }));
};
const tabs: GranjasStatusText[] = [
  "Todos",
  "Activos",
  "Offline",
  "Alguno Offline",
  "Indeterminado",
];

const GranjasSA: React.FC = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  //const allServices = useMemo(() => generateMockServices(100), []);
  const { servers, startAllClusters } = useGranjasSa();
  //const [services, setServices] = useState<GranjaDTOModel[]>(allServices);
  const [activeTab, setActiveTab] = useState<GranjasStatusText | "Todos">(
    "Todos"
  );

  const handleStartAll = () => {
    setConfirmMessage("¿Desea iniciar todas las granjas?");
    setConfirmAction(() => executeStartAll);
    setShowConfirm(true);
  };

  const executeStartAll = async () => {
    setShowConfirm(false);
    await startAllClusters(); // Call the function from the hook
  };

  const handleStopAll = () => {
    /* TODOOOOOOOOO*/
    setConfirmMessage(
      "¿Estás seguro de que quieres detener todos los procesos?"
    );
    // setConfirmAction(() => handleStopAll);
    setShowConfirm(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-[#00693c]">
        Granjas SA Producción
      </h1>
      <Tabs
        selectedIndex={tabs.indexOf(activeTab)}
        onSelect={(index: number) => {
          const tab = tabs[index];
          setActiveTab(tab as GranjasStatusText);
        }}
      >
        <TabList className="flex mb-4">
          {tabs.map((tab) => (
            <Tab
              key={tab}
              className="px-4 py-2 mr-2 rounded-t cursor-pointer bg-gray-200"
              selectedClassName="bg-blue-500 text-white"
            >
              {tab}
            </Tab>
          ))}
        </TabList>
        {/* Generar los TabPanel dinámicamente */}
        {tabs.map((tab, index) => (
          <TabPanel key={index}>
            <ServicesTabContent
              services={servers}
              activeTab={tab}
              onStartAll={handleStartAll}
              onStopAll={handleStopAll}
            />
          </TabPanel>
        ))}
      </Tabs>
      {/* Popup de confirmación */}
      {showConfirm && (
        <ConfirmPopup
          message={confirmMessage}
          onConfirm={confirmAction}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default GranjasSA;
