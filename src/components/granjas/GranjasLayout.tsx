import { useState } from "react";
import { GranjasStatusText } from "../../types/granjasTypes/granjasSA";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import GranjasTabContent from "./GranjasTabContent";
import ConfirmPopup from "../general/ConfirmPopup";
import { useGranjas } from "../../hooks/granjas/useGranjas";

const tabs: GranjasStatusText[] = [
  "Todos",
  "Activos",
  "Offline",
  "Alguno Offline",
  "Indeterminado",
];

interface GranjasProps {
  path: string;
  title: string;
}

const GranjasLayout: React.FC<GranjasProps> = ({ path, title }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});
  //const allServices = useMemo(() => generateMockServices(100), []);
  const { servers, handleAllClustersAction, handleSingleClusterAction } =
    useGranjas(path);
  //const [services, setServices] = useState<GranjaDTOModel[]>(allServices);
  const [activeTab, setActiveTab] = useState<GranjasStatusText | "Todos">(
    "Todos"
  );

  const executeActionForAll = async (action: string) => {
    setShowConfirm(false);
    await handleAllClustersAction(action); // Call the function from the hook
  };

  const executeActionSingle = async (code: string, action: string) => {
    setShowConfirm(false);
    await handleSingleClusterAction(code, action);
  };

  //functions for single
  const handleStartSingleAction = (code: string) => {
    const action: string = "start";
    setConfirmMessage(`¿Desea iniciar la granja ${code}?`);
    setConfirmAction(() => () => executeActionSingle(code, action));
    setShowConfirm(true);
  };

  const handleStopSingleAction = (code: string) => {
    const action: string = "stop";
    setConfirmMessage(`¿Desea detener la granja ${code}?`);
    setConfirmAction(() => () => executeActionSingle(code, action));
    setShowConfirm(true);
  };

  //functions for all
  const handleStartAll = () => {
    const action: string = "start";
    setConfirmMessage("¿Desea iniciar todas las granjas?");
    setConfirmAction(() => () => executeActionForAll(action));
    setShowConfirm(true);
  };

  const handleStopAll = () => {
    const action: string = "stop";
    setConfirmMessage("¿Desea detener todas las granjas?");
    setConfirmAction(() => () => executeActionForAll(action));
    setShowConfirm(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-[#00693c]">{title}</h1>
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
            <GranjasTabContent
              services={servers}
              activeTab={tab}
              onStartAll={handleStartAll}
              onStopAll={handleStopAll}
              onStartSingle={handleStartSingleAction}
              onStopSingle={handleStopSingleAction}
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

export default GranjasLayout;
