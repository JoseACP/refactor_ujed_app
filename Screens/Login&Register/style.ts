import { StyleSheet } from "react-native";

const styles=StyleSheet.create({
    mainContainer: {
        backgroundColor: 'white',
      },
      textSign: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
      },
      smallIcon: {
        marginTop:-2,
        paddingBottom: 12,
        marginRight: 10,
        fontSize: 24,
      },
      logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      logo: {
        height: 260,
        width: 260,
        marginTop: 50,
        marginBottom:40,
      },
      text_footer: {
        color: '#05375a',
        fontSize: 18,
      },
      action: {
        flexDirection: 'row',
        paddingTop: 11,
        // paddingBottom: 3,
        marginTop: 15,
    
        paddingHorizontal: 15,
        backgroundColor:'#EEEDED',
        borderWidth: 1,
        borderColor: '#ce112d',
        borderRadius: 15,
      },
      textInput: {
        flex: 4,
        marginTop: -12,
        color: '#000000',
        
      },
      loginContainer: {
       alignItems:'center',
       marginTop: -14,
        // backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 50,
        paddingVertical: 40,
        margin: 15
      },
      header: {
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
      },
      text_header: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 30,
        margin: 2
      },
      button: {
        alignItems: 'center',
        marginTop: -20,
        alignItems: 'center',
        textAlign: 'center',
        margin: 20,
      },
      inBut: {
        width: '70%',
        backgroundColor: '#ce112d',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 50,
      },
      inBut2: {
        backgroundColor: '#ce112d',
        height: 65,
        width: 65,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
      },
      bottomButton: {
        alignContent: "center",
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      smallIcon2: {
        paddingBottom: 12,
        marginRight: 10,
        fontSize: 24,
        // marginRight: 10,
      },
      bottomText: {
        color: '#ce112d',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 5,
      },
})
export default styles;