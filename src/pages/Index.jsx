import React, { useState, useEffect } from "react";
import { Box, Button, Input, Text, VStack, useToast } from "@chakra-ui/react";
import { FaPlus, FaSave, FaTrash } from "react-icons/fa";

const Index = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const toast = useToast();

  const SUPABASE_URL = "https://mnwefvnykbgyhbdzpleh.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ud2Vmdm55a2JneWhiZHpwbGVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMyNzQ3MzQsImV4cCI6MjAyODg1MDczNH0.tnHysd1LqayzpQ1L-PImcvlkUmkNvocpMS7tS-hYZNg";

  const fetchHeaders = {
    "Content-Type": "application/json",
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  };

  // Fetch notes from Supabase
  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/notes`, {
      headers: fetchHeaders,
    })
      .then((response) => response.json())
      .then((data) => setNotes(data))
      .catch((error) => console.error("Error fetching notes:", error));
  }, []);

  // Add a new note
  const addNote = () => {
    fetch(`${SUPABASE_URL}/rest/v1/notes`, {
      method: "POST",
      headers: fetchHeaders,
      body: JSON.stringify({ note: newNote }),
    })
      .then((response) => response.json())
      .then((data) => {
        setNotes([...notes, data[0]]);
        setNewNote("");
        toast({
          title: "Note added",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      })
      .catch((error) => console.error("Error adding note:", error));
  };

  // Update a note
  const updateNote = (id, updatedNote) => {
    fetch(`${SUPABASE_URL}/rest/v1/notes?id=eq.${id}`, {
      method: "PATCH",
      headers: fetchHeaders,
      body: JSON.stringify({ note: updatedNote }),
    })
      .then(() => {
        setNotes(notes.map((note) => (note.id === id ? { ...note, note: updatedNote } : note)));
        toast({
          title: "Note updated",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      })
      .catch((error) => console.error("Error updating note:", error));
  };

  // Delete a note
  const deleteNote = (id) => {
    fetch(`${SUPABASE_URL}/rest/v1/notes?id=eq.${id}`, {
      method: "DELETE",
      headers: fetchHeaders,
    })
      .then(() => {
        setNotes(notes.filter((note) => note.id !== id));
        toast({
          title: "Note deleted",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      })
      .catch((error) => console.error("Error deleting note:", error));
  };

  return (
    <VStack spacing={4}>
      <Input placeholder="Add a new note" value={newNote} onChange={(e) => setNewNote(e.target.value)} />
      <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={addNote}>
        Add Note
      </Button>
      {notes.map((note) => (
        <Box key={note.id} p={5} shadow="md" borderWidth="1px" flex="1" borderRadius="md">
          <Text mb={2}>{note.note}</Text>
          <Button leftIcon={<FaSave />} colorScheme="yellow" onClick={() => updateNote(note.id, note.note)}>
            Update
          </Button>
          <Button leftIcon={<FaTrash />} colorScheme="red" onClick={() => deleteNote(note.id)}>
            Delete
          </Button>
        </Box>
      ))}
    </VStack>
  );
};

export default Index;
