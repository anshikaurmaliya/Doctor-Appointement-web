import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import assets from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
const DoctorDashboard = () => {
  const { dToken, dashData, setDashData, getDashData,completeAppointment,cancelAppointment } =
    useContext(DoctorContext);
  const { slotDateFormat } = useContext(AppContext);
  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);
  return (
    dashData && (
      <div className="flex flex-col px-2 sm:px-4 md:px-6 lg:px-10 py-4">
        {/* Summary Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {/* Doctors Box */}
          <div className="flex items-center gap-3 bg-white p-4 rounded border-2 border-gray-100 shadow-sm hover:scale-105 transition-all">
            <img className="w-12 sm:w-14" src={assets.earning_icon} alt="" />
            <div>
              <p className="text-lg sm:text-xl font-semibold text-gray-600">
                ${dashData.earnings}
              </p>
              <p className="text-sm text-gray-400">Earnings</p>
            </div>
          </div>

          {/* Appointments Box */}
          <div className="flex items-center gap-3 bg-white p-4 rounded border-2 border-gray-100 shadow-sm hover:scale-105 transition-all">
            <img
              className="w-12 sm:w-14"
              src={assets.appointments_icon}
              alt=""
            />
            <div>
              <p className="text-lg sm:text-xl font-semibold text-gray-600">
                {dashData.appointments}
              </p>
              <p className="text-sm text-gray-400">Appointments</p>
            </div>
          </div>

          {/* Patients Box */}
          <div className="flex items-center gap-3 bg-white p-4 rounded border-2 border-gray-100 shadow-sm hover:scale-105 transition-all">
            <img className="w-12 sm:w-14" src={assets.patients_icon} alt="" />
            <div>
              <p className="text-lg sm:text-xl font-semibold text-gray-600">
                {dashData.patients}
              </p>
              <p className="text-sm text-gray-400">Patients</p>
            </div>
          </div>
        </div>

        {/* Latest Bookings */}
        <div className="bg-white rounded shadow-sm">
          <div className="flex items-center gap-2.5 px-4 py-4 border-b">
            <img src={assets.list_icon} className="w-6 h-6" alt="" />
            <p className="font-semibold text-lg sm:text-xl">Latest Bookings</p>
          </div>

          <div className="divide-y">
            {dashData.latestAppointments.map((item, index) => (
              <div
                key={index}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src={item.userData?.image || "/default-avatar.png"}
                    alt=""
                  />
                  <div>
                    <p className="font-medium text-sm sm:text-base">
                      {item.userData?.name || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {slotDateFormat(item.slotDate)}
                    </p>
                  </div>
                </div>

                {item.cancelled ? (
                  <p className="text-red-500 text-sm font-medium">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-sm font-medium">
                    Completed
                  </p>
                ) : (
                  <div className="flex gap-2">
                    <img
                      onClick={() => cancelAppointment(item._id)}
                      className="w-6 sm:w-8 cursor-pointer"
                      src={assets.cancel_icon}
                      alt="Cancel"
                    />
                    <img
                      onClick={() => completeAppointment(item._id)}
                      className="w-6 sm:w-8 cursor-pointer"
                      src={assets.tick_icon}
                      alt="Complete"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorDashboard;
