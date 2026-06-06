import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    saveImage: {
        width: 230,
        height: 150,
        borderRadius: 10,

    },

    trashButton: {
        //  position: 'absolute',
        borderRadius: 10,
        padding: 2,
        backgroundColor: 'white',
        bottom: 30,
        right: -200,
        // borderWidth: 1,
        // borderColor: '#ce112d',
        width: 40, // Ajusta el ancho del contenedor según sea necesario
        height: 40,
        justifyContent: 'center', // Centra verticalmente
        alignItems: 'center', // Centra horizontalmente
        shadowColor: '#000', // Color de la sombra
        shadowOffset: {
            width: 0,  // Ancho del desplazamiento de la sombra (horizontal)
            height: 2, // Altura del desplazamiento de la sombra (vertical)
        },
        shadowOpacity: 0.3, // Opacidad de la sombra
        shadowRadius: 3, // Radio de la sombra
        elevation: 7, // Solo para Android, elevación de la sombra


    },
    saveImageV: {
        flexDirection: 'row', // Alinear los elementos en una fila
        justifyContent: 'center', // Centrar horizontalmente
        alignItems: 'center', // Centrar verticalmente
    },
    inButT: {
        width: '70%',
        backgroundColor: '#ce112d',
        alignItems: 'center',
        marginTop: 40,
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 50,
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    editIcon: {
        zIndex: 1,
        color: 'white',
        position: 'absolute',
        right: 2,
        margin: 15,
    },
    logoContainer: {
        marginBottom: -12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        height: 260,
        width: 260,
        marginTop: 50,
        marginBottom: 40,
        borderWidth: 1,
        borderColor: '#ce112d',
        borderRadius: 8,
    },
    backIcon: {
        zIndex: 1,
        color: 'white',
        position: 'absolute',
        left: 2,
        margin: 15,
    },
    // 
    btnText: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
        fontWeight: '600',
    },
    text_header: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 30,
        margin: 15
    },
    button: {
        alignItems: 'center',
        marginTop: -20,
        alignItems: 'center',
        textAlign: 'center',
        margin: 20,
    },
    inBut: {
        width: '25%',
        backgroundColor: '#ce112d',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 10,
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    text_container: {
        marginTop: 20,
        marginLeft: 5,
        flexDirection: 'row',
        alignItems: 'center', // Alinea verticalmente los elementos en el centro
    },
    text1: {
        fontSize: 17,
        fontWeight: '700',
        color: '#ce112d'
    },
    text2: {
        fontSize: 14, // Ajusta el tamaño del segundo texto
        color: 'blue', // Cambia el color a azul
        marginLeft: 10, // Añade un espacio entre los textos
    },
    loginContainer: {
        alignItems:'center',
        marginTop: 2,
        // backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 50,
        paddingVertical: 40,
        margin: 15
    },
    textInput: {
        flex: 4,
        marginTop: -12,
        color: '#000000',

    },
    action: {
        flexDirection: 'row',
        paddingTop: 14,
        paddingBottom: 60,
        marginTop: 30,
        paddingHorizontal: 10,
        backgroundColor: '#E7E7E7',
        borderWidth: 1,
        borderColor: '#ce112d',
        borderRadius: 8,
    },
    action2: {
        flexDirection: 'row',
        paddingTop: 14,
        paddingBottom: 30,
        marginTop: 30,
        paddingHorizontal: 10,
        backgroundColor: '#E7E7E7',
        borderWidth: 1,
        borderColor: '#ce112d',
        borderRadius: 8,
    },
    image: {
        width: 220,
        height: 150,
        borderRadius: 8,
        marginBottom: 8, // Espaciado entre la imagen y el título
    },
})
export default styles;