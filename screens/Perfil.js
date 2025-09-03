import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext"; // Import useTheme
import { estilos } from "./Perfil.styles";

export default function TelaPerfil({ navigation }) {
  const { user, logout, updateUser, updateUserImage } = useAuth();
  const { theme } = useTheme(); // Use theme
  const [modalVisivel, setModalVisivel] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [dadosFormulario, setDadosFormulario] = useState({
    nome: user?.nome || "",
    data_nascimento: user?.data_nascimento || "",
    codigo_funcionario: user?.codigo_funcionario || "",
    cargo: user?.cargo || "",
  });

  useEffect(() => {
    if (user) {
      setDadosFormulario({
        nome: user.nome || "",
        data_nascimento: user.data_nascimento || "",
        codigo_funcionario: user.codigo_funcionario || "",
        cargo: user.cargo || "",
      });
    }
  }, [user]);

  const escolherImagem = async () => {
    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!resultado.canceled) {
      const newImageUrl = resultado.assets[0].uri;
      updateUserImage(newImageUrl);
    }
  };

  const handleChange = (campo, valor) => {
    setDadosFormulario((anterior) => ({ ...anterior, [campo]: valor }));
  };

  const handleSaveChanges = async () => {
    try {
      const result = await updateUser(user.id, dadosFormulario);
      if (result.success) {
        Alert.alert("Sucesso", "Seus dados foram atualizados.");
        setIsEditing(false);
      } else {
        Alert.alert("Erro", result.message || "Não foi possível atualizar seus dados.");
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao salvar as alterações.");
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const renderInfoLinha = (icone, placeholder, valor, campo) => (
    <View style={estilos.infoRow}>
      <Ionicons name={icone} size={24} color={theme.text} style={estilos.infoIcon} />
      <TextInput
        style={[estilos.infoInput, { color: theme.text, borderBottomColor: theme.border }, isEditing && { borderBottomColor: theme.primary }]}
        value={valor}
        onChangeText={(text) => handleChange(campo, text)}
        placeholder={placeholder}
        placeholderTextColor={theme.text}
        editable={isEditing}
      />
    </View>
  );

  const renderBotao = (icone, texto, onPress) => (
    <TouchableOpacity style={estilos.button} onPress={onPress}>
      <Ionicons name={icone} size={24} color={theme.text} style={estilos.buttonIcon} />
      <Text style={[estilos.buttonText, { color: theme.text }]}>{texto}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[estilos.container, { backgroundColor: theme.background }]}>
      <SafeAreaView>
        <View style={estilos.header}>
          <TouchableOpacity onPress={escolherImagem} style={estilos.profileImageContainer}>
            <Image
              source={user?.imagemPerfil ? { uri: user.imagemPerfil } : require("../assets/img/perfil.png")}
              style={estilos.profileImage}
            />
          </TouchableOpacity>
          <Text style={[estilos.userName, { color: theme.text }]}>{user?.nome || "Nome do Usuário"}</Text>
          <Text style={[estilos.userEmail, { color: theme.text }]}>{user?.email || "email@exemplo.com"}</Text>
        </View>

        <View style={[estilos.card, { backgroundColor: theme.card }]}>
          <Text style={[estilos.cardTitle, { color: theme.text }]}>Informações Pessoais</Text>
          {renderInfoLinha("person-outline", "Nome", dadosFormulario.nome, "nome")}
          {renderInfoLinha("calendar-outline", "Nascimento", dadosFormulario.data_nascimento, "data_nascimento")}
          {renderInfoLinha("barcode-outline", "Código", dadosFormulario.codigo_funcionario, "codigo_funcionario")}
          {renderInfoLinha("briefcase-outline", "Cargo", dadosFormulario.cargo, "cargo")}
          
          {isEditing ? (
            <TouchableOpacity style={[estilos.saveButton, { backgroundColor: theme.primary }]} onPress={handleSaveChanges}>
              <Text style={[estilos.saveButtonText, { color: theme.buttonText }]}>Salvar Alterações</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[estilos.editProfileButton, { backgroundColor: theme.primary }]} onPress={() => setIsEditing(true)}>
              <Ionicons name="create-outline" size={24} color={theme.buttonText} />
              <Text style={[estilos.editProfileButtonText, { color: theme.buttonText }]}>Editar Perfil</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={[estilos.card, { backgroundColor: theme.card }]}>
          <Text style={[estilos.cardTitle, { color: theme.text }]}>Configurações</Text>
          {renderBotao("color-palette-outline", "Temas", () => navigation.navigate("Temas"))}
          {renderBotao("language-outline", "Linguagem", () => navigation.navigate("Linguagens"))}
        </View>

        <View style={[estilos.card, { backgroundColor: theme.card }]}>
          {renderBotao("log-out-outline", "Sair", handleLogout)}
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisivel}
          onRequestClose={() => setModalVisivel(false)}
        >
          <View style={estilos.modalOverlay}>
            <View style={[estilos.modalContent, { backgroundColor: theme.card }]}>
              <TouchableOpacity onPress={() => setModalVisivel(false)} style={estilos.closeButton}>
                <Ionicons name="close-circle" size={30} color={theme.error} />
              </TouchableOpacity>
              <Text style={[estilos.modalTitle, { color: theme.text }]}>Alterar Senha</Text>
              {/* Adicionar campos para alterar senha aqui */}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ScrollView>
  );
}
