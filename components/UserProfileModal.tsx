
import { useAuth } from "@/context/AuthContext";
import { Modal, Pressable, TouchableOpacity, View } from "react-native";
import Typo from "./Typo";

interface Props {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserProfile = ({ isVisible, setIsVisible }: Props) => {
  const { user, logout } = useAuth();

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setIsVisible(false)}
    >
      <Pressable
        onPress={() => setIsVisible(false)}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.3)",
        }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              position: "absolute",
              top: 60,
              right: 16,
              backgroundColor: "#f4f4f4",
              borderRadius: 12,
              paddingVertical: 8,
              paddingHorizontal: 12,
              minWidth: 180,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 6,
              elevation: 8,
            }}
          >
            <View style={{ marginBottom: 8 }}>
              <Typo size={16} fontWeight={600} color="#094770">
                {user?.name || 'Bhola'}
              </Typo>
              <Typo size={13} color="#777">
                {user.role || 'Admin'}
              </Typo>
            </View>

            <TouchableOpacity
              onPress={() => {
                setIsVisible(false);
              }}
              style={{
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#eee",
              }}
            >
              <Typo size={15} color="#094770" fontWeight="500">
                View / Edit Profile
              </Typo>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={logout}
              style={{
                paddingVertical: 10,
              }}
            >
              <Typo size={15} color="red" fontWeight="500">
                Sign Out
              </Typo>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default UserProfile;
