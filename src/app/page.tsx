"use client";

import { BellIcon, ClockIcon } from "lucide-react";
import { useEffect, useState } from "react";

// Tipagem para as variáveis de estado
type TimerState = {
  minutes: number;
  isRunning: boolean;
  timeRemaining: number | null;
};

const Home = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [alarmTime, setAlarmTime] = useState<Date | null>(null);
  const [timerState, setTimerState] = useState<TimerState>({
    minutes: 0,
    isRunning: false,
    timeRemaining: null,
  });

  // Atualiza o horário atual a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Carrega as configurações do alarme e timer do localStorage
  useEffect(() => {
    const savedAlarmTime = localStorage.getItem("alarmTime");
    const savedTimerMinutes = localStorage.getItem("timerMinutes");

    if (savedAlarmTime) {
      setAlarmTime(new Date(savedAlarmTime));
    }
    if (savedTimerMinutes) {
      setTimerState((prev) => ({
        ...prev,
        minutes: Number(savedTimerMinutes),
      }));
    }
  }, []);

  // Lida com o início do timer quando o alarme dispara
  useEffect(() => {
    if (
      alarmTime &&
      currentTime.getHours() === alarmTime.getHours() &&
      currentTime.getMinutes() === alarmTime.getMinutes() &&
      !timerState.isRunning
    ) {
      setTimerState((prev) => ({
        ...prev,
        isRunning: true,
        timeRemaining: prev.minutes * 60,
      }));
    }
  }, [currentTime, alarmTime, timerState.minutes, timerState.isRunning]);

  // Atualiza o timer em execução
  useEffect(() => {
    if (timerState.isRunning && timerState.timeRemaining !== null) {
      if (timerState.timeRemaining > 0) {
        const timeout = setTimeout(() => {
          setTimerState((prev) => ({
            ...prev,
            timeRemaining: prev.timeRemaining! - 1,
          }));
        }, 1000);
        return () => clearTimeout(timeout);
      } else {
        setTimerState({ minutes: 0, isRunning: false, timeRemaining: null });
      }
    }
  }, [timerState]);

  const saveAlarm = () => {
    const hours = prompt("Defina a hora do alarme (HH):");
    const minutes = prompt("Defina os minutos do alarme (MM):");

    if (hours && minutes) {
      const newAlarmTime = new Date();
      newAlarmTime.setHours(Number(hours));
      newAlarmTime.setMinutes(Number(minutes));
      newAlarmTime.setSeconds(0);
      setAlarmTime(newAlarmTime);
      localStorage.setItem("alarmTime", newAlarmTime.toString());
    }
  };

  const saveTimer = () => {
    const minutes = prompt("Defina a duração do timer em minutos:");

    if (minutes) {
      const timerMinutes = Number(minutes);
      setTimerState((prev) => ({
        ...prev,
        minutes: timerMinutes,
      }));
      localStorage.setItem("timerMinutes", minutes);
    }
  };

  // Lógica de alteração de fundo durante a contagem do timer
  const backgroundClass =
    timerState.isRunning && timerState.timeRemaining! < 5 * 60 // 5 minutos
      ? "bg-red-900 text-white"
      : "bg-background text-foreground";

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${backgroundClass}`}
    >
      {/* Horário atual ou o timer */}
      {timerState.isRunning ? (
        <div className="text-7xl md:text-9xl font-bold text-center">
          {`${Math.floor(timerState.timeRemaining! / 60)}:${
            timerState.timeRemaining! % 60 < 10 ? "0" : ""
          }${timerState.timeRemaining! % 60}`}

          <p className="mt-4 text-lg">{currentTime.toLocaleTimeString()}</p>
        </div>
      ) : (
        <>
          <h1 className="text-7xl md:text-9xl font-bold">
            {currentTime.toLocaleTimeString()}
          </h1>
          {/* Status do alarme */}
          <p className="mt-4 text-lg">
            {alarmTime
              ? `Alarme configurado para: ${alarmTime.toLocaleTimeString()}`
              : "Nenhum alarme configurado"}
          </p>
        </>
      )}

      {/* Botões de configuração */}
      <div className="mt-8 space-x-4 flex items-center gap-4">
        <button
          onClick={saveAlarm}
          className="size-8 flex items-center justify-center text-sm rounded-full border border-foreground"
        >
          <BellIcon className="size-4" />
        </button>
        <button
          onClick={saveTimer}
          className="size-8 flex items-center justify-center text-sm rounded-full border border-foreground"
        >
          <ClockIcon className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default Home;
