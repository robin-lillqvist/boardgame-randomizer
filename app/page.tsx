"use client";
import { useState, useRef } from "react";
import { Button, ButtonGroup } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { CheckboxGroup, Checkbox } from "@nextui-org/checkbox";

import styles from "./page.module.css";

type Game = "Twilight Imperium";
type Faction = string;

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [randomizedParticipants, setRandomizedParticipants] = useState<string[]>([]);
  const [availableFactions, setAvailableFactions] = useState<Faction[]>([]);

  return (
    <section className='flex flex-col items-center justify-center gap-4 py-8 md:py-10 page'>
      <div className='inline-block max-w-lg text-center justify-center'>
        {games.map((game) => (
          <button key={game} onClick={() => setSelectedGame(game)} className={styles.game_button}>
            {game}
          </button>
        ))}
      </div>
      <div className='mw'>
        {selectedGame && (
          <div className='mt-8'>
            <h1>{selectedGame}</h1>
            <ParticipantForm
              onRandomize={(participants) => {
                const shuffled = randomizeArray(participants);
                setRandomizedParticipants(shuffled);
                setAvailableFactions(factions[selectedGame]);
              }}
              onRemove={(updatedParticipants) => {
                setRandomizedParticipants(updatedParticipants);
              }}
            />
          </div>
        )}

        {randomizedParticipants.length > 0 && (
          <FactionSelection participants={randomizedParticipants} availableFactions={availableFactions} />
        )}
      </div>
    </section>
  );
}

function ParticipantForm({
  onRandomize,
  onRemove,
}: {
  onRandomize: (participants: string[]) => void;
  onRemove: (updatedParticipants: string[]) => void;
}) {
  const [participants, setParticipants] = useState<string[]>([""]);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const addParticipant = () => {
    setParticipants((prevParticipants) => [...prevParticipants, ""]);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addParticipant();
      setTimeout(() => {
        const nextIndex = index + 1;
        if (inputRefs.current[nextIndex]) {
          inputRefs.current[nextIndex].focus();
        }
      }, 0);
    } else if ((event.key === "Backspace" || event.key === "Delete") && participants[index] === "") {
      event.preventDefault();
      removeParticipant(index);
      setTimeout(() => {
        const previousIndex = index - 1;
        if (inputRefs.current[previousIndex]) {
          inputRefs.current[previousIndex].focus();
        }
      }, 0);
    }
  };

  const updateParticipant = (index: number, value: string) => {
    const newParticipants = [...participants];
    newParticipants[index] = value;
    setParticipants(newParticipants);
  };

  const removeParticipant = (index: number) => {
    const newParticipants = participants.filter((_, i) => i !== index);
    setParticipants(newParticipants);
    onRemove(newParticipants);
  };

  const clearParticipants = () => {
    // Reset the participants state to an array with one empty string
    setParticipants([""]);
  };

  return (
    <div className={styles.participants}>
      <h2 className='mt-2'>Deltagare</h2>
      {participants.map((participant, index) => (
        <div key={index} className={styles.participant_input}>
          <Input
            color='default'
            type='text'
            value={participant}
            onChange={(e) => updateParticipant(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => {
              if (el) {
                inputRefs.current[index] = el;
              }
            }}
          />
        </div>
      ))}
      <div className={styles.buttons}>
        <Button color='danger' variant='bordered' onClick={clearParticipants}>
          <strong>Rensa</strong>
        </Button>

        <Button color='success' onClick={() => onRandomize(participants)}>
          <strong>Randomisera</strong>
        </Button>
      </div>
    </div>
  );
}

function FactionSelection({
  participants,
  availableFactions,
}: {
  participants: string[];
  availableFactions: Faction[];
}) {
  const [factions, setFactions] = useState(availableFactions.map((faction) => ({ name: faction, selected: true })));
  const [assignments, setAssignments] = useState<Record<string, string[]>>({});

  const toggleFaction = (index: number) => {
    const newFactions = [...factions];
    newFactions[index].selected = !newFactions[index].selected;
    setFactions(newFactions);
  };

  const assignFactions = () => {
    const selectedFactions = factions.filter((faction) => faction.selected).map((faction) => faction.name);

    let newAssignments: Record<string, string[]> = {};
    participants.forEach((participant) => {
      newAssignments[participant] = [];
    });

    const totalRounds = 2; // Each participant selects 2 races
    for (let round = 0; round < totalRounds; round++) {
      const shuffledParticipants = randomizeArray(participants);
      shuffledParticipants.forEach((participant, index) => {
        if (selectedFactions.length > 0) {
          const selectedFaction = selectedFactions.shift();
          if (selectedFaction) {
            newAssignments[participant].push(selectedFaction);
          }
        }
      });
    }

    setAssignments(newAssignments);
  };

  return (
    <div>
      <h1>Faktioner</h1>
      {factions.map((faction, index) => (
        <div key={index}>
          <input type='checkbox' checked={faction.selected} onChange={() => toggleFaction(index)} />
          <label>{faction.name}</label>
        </div>
      ))}
      <Button color='success' onClick={assignFactions} className='mt-8'>
        <strong>Tilldela raser/faktioner</strong>
      </Button>

      {Object.keys(assignments).length > 0 && (
        <div className='mt-8'>
          <h1>Tilldelade raser/faktioner:</h1>
          {participants.map((participant) => (
            <div key={participant}>
              <strong>{participant}:</strong>{" "}
              {assignments[participant] ? assignments[participant].join(", ") : "Ingen ras/faktion tilldelad"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function randomizeArray<T>(array: T[]): T[] {
  return array
    .map((a) => [Math.random(), a] as [number, T])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1]);
}

const games: Game[] = ["Twilight Imperium"];
const factions: Record<Game, Faction[]> = {
  "Twilight Imperium": [
    "The Arborec",
    "The Barony of Letnev",
    "The Clan of Saar",
    "The Embers of Muaat",
    "The Emirates of Hacan",
    "The Federation of Sol",
    "The Ghosts of Creuss",
    "The L1Z1X Mindnet",
    "The Mentak Coalition",
    "The Naalu Collective",
    "The Nekro Virus",
    "Sardakk N'orr",
    "The Universities of Jol-Nar",
    "The Winnu",
    "The Xxcha Kingdom",
    "The Yssaril Tribes",
    "The Yin Brotherhood",
    "The Argent Flight",
    "The Empyrean",
    "The Mahact Gene-Sorcerers",
    "The Naaz-Rokha Alliance",
    "The Nomad",
    "The Titans of Ul",
    "The Vuil'raith Cabal",
  ],
};
