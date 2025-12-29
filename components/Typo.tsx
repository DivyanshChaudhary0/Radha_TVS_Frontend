
import { TypoProps } from "@/utils/types";
import { Text, TextStyle } from "react-native";

const Typo = ({ style,children,color,size,fontWeight = "400", textProps={}}: TypoProps) => {

    const textStyle: TextStyle = {
        fontSize: size,
        color,
        fontWeight
    }

  return( 
    <Text style={[ textStyle, style ]} {...textProps} >
        {children}
    </Text>
  );
};

export default Typo;
