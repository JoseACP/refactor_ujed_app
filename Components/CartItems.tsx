import { Center, Pressable, Box, Text, Image, HStack, VStack, Button, View, CheckIcon } from 'react-native'
import React from 'react'
import { SwipeListView } from "react-native-swipe-list-view"
import products from '../Products'
import { FontAwesome } from '@expo/vector-icons';

const Swiper = () => (
    <SwipeListView
    rightOpenValue={-50}
    previewRowKey={0}
    previewOpenValue={-40}
    previewOpenDelay={3000}
    data={products}
    renderItem={renderItems}
    renderHiddenItem={HiddenItems}
    showsVerticalScrollIndicator={false}
    />
)

const renderItems = (data) =>(
    <Pressable>
        <Box ml={6} mb={3}>
            <HStack 
            alignItems="center" 
            bg={'white'} 
            shadow={1} 
            rounded={10} 
            overflow="hidden"
            >
                <Center 
                w="25%" 
                bg="gray.400">
                    <Image 
                    source={{uri: data.item.image}} 
                    alt={data.item.name} 
                    w="full" 
                    h={24}
                    resizeMethod='contain'
                    />    
                </Center>
                <VStack w="60%" px={2} space={2}>
                    <Text isTruncated color="black" bold fontSize={14}>
                        {data.item.name}
                    </Text>
                    <Text bold color="gray.300">${data.item.price}</Text>
                </VStack>
                <Center>
                    <Button bg="red.500" 
                    _pressed={{
                        bg: "red.500"
                    }}
                    _text={{
                        color: "white"
                    }}>
                        5
                    </Button>
                </Center>
            </HStack>
        </Box>
    </Pressable>
)

const HiddenItems = () =>(
    <Pressable 
    w={50} 
    roundedTopRight={10} 
    roundedBottomRight={10} 
    h='88%' 
    ml='auto' 
    justifyContent="center" 
    bg="red.400"
    >
        <Center 
        alignItems='center' 
        space={2}
        >
            <FontAwesome 
            name='trash' 
            size={24} 
            color="white"/>
        </Center>
    </Pressable>
)



const CartItems = () => {
  return (
    <Box mr={6}>
        <Swiper/>
    </Box>
  )
}

export default CartItems

