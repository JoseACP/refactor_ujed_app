import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { AntDesign } from '@expo/vector-icons';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { useNavigation, useRoute } from '@react-navigation/native';

const PdfScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedDescription, currentDate, description } = route.params;
  console.log(currentDate, selectedDescription, description)

  const formattedDate = new Date(currentDate);
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  const day = formattedDate.getDate();
  const monthIndex = formattedDate.getMonth();
  const year = formattedDate.getFullYear();

  const formattedDateString = `${day} de ${months[monthIndex]} de ${year}`;

  const htmlContent = `
    <html>
      <head>
      <style>
      /* Coloca aquí tus estilos CSS */
      body {
          font-family: Arial, sans-serif;
          margin: 40px;
      }
      .container {
          padding: 20px;
          background-color: #f9f9f9;
          margin-top: 50px;
      }
      .logo {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
      }
      .logo img {
          max-width: 100px;
          height: 50px;
      }
      .content {
          font-size: 16px;
          line-height: 24px;
      }
      .heading {
          font-size: 13px;
          margin-bottom: 10px;
      }
      .paragraph {
          text-align: justify;
          margin-bottom: 10px;
      }
      .signature {
          margin-top: 20px;
          align-items: center;
      }
      .signatureTextCentered {
          margin-top: 20px;
          font-size: 14px;
          font-weight: bold;
          text-align: center;
      }
      .bold {
          font-weight: bold;
      }
      .emphasis {
          font-weight: bold;
      }
      /* Clase para justificar el texto dentro de {description} */
      .justified {
          text-align: justify;
      }
  </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACoCAMAAABt9SM9AAAAk1BMVEX///8+U2YxSV45T2MrRVskQFc2TWE6UGMoQ1kuR1w0S2ApRFoiP1a1u8Gfp68XOFHO0taVnqfz9PXl5+lcbHvZ3N9WZ3fBxstteoft7vD4+fqwtr2psLdkc4EALkpvfImCjZhQYnOLlZ94hJCBjJfGy8/V2NxEWGvf4eQPNE6jq7IAKkeRmqNKXW8AIkIAH0AAEjlp4pW8AAAgAElEQVR4nO1diWKjuLIV+75vZjObMRjDzPv/r3tVEt7STsfpuHsyc133TjoBAdJBtapUEPKiF73oRS960Yte9KIXvehFL3rRi170ohe96EUvetGLXvSi/xplv6ntf5HibfRwW+vY/saefH9KNPlxAEJ52P/Gvnx7ynlh83DjQTH+h8GKwkaWnO7mWN5dqL85s5iqEpfpn+zgt6JZq7L9LR82uqxL5mBKsqzVN2eqNNM06w/27pvRKJVpEPjXhyRO0XFGJTwnxNcngjFyeeV/VyH2B05RVfV4xVqRwWl+1oYtCVROumrrbg1D5Lhj8Md7+U3IFzhOkcxrPrR4fiKcrvAc8XTj2qwITZXjhOZP9/H7UCUo5e2RUjDG3uA4TnX3ou7dntQ5+c2R/x2KKp7jhixFGscxivbFInPG6KoI1n4vctquj6IIzgXYJgA2FNv/MT4c87osF1k1NFnXeQdJVSVJUiVRFmRxIo0maw3xRFnh8Sj8p9JWMpCmqkJThmXZJv/0OH4/Zbag8rKgKBzwlGfbHtA8y1zTlMumi7tdZ6TErmwSiN2uCrty2CwNN3itx6iVQc4BCbrG/9fhynRgvZXkuu8TJKvjz+ZDRgYDjSlLKi+O8yjVFm3Z95Vwvp47jP/IGP4Y7dXLWDm9AjN917btoDuHE5kyc4AG+XLM0eO5bWtovdGvrv+vm6iJdhmrEOIRP0lys7i0yLWK/tuI7uVgy3ceQ0a5Aou/uuy/SIl4NViVHpraWg03K1Vdowh0NilC2FWnw43mzRSsVLq+vv/ps/79dM1G6ipzHJtkJwrAyAIXaBxFTvfPR8lutUb7K7D/+xaqe+FDBcQ2pUMBP/I8L4oin2WFYSBx/FTgkTyHs7aa0KadeuFD42fyfd+2oGvhcisvJtub2yufKpvb2ZvgFDsTefCnPV2aRuP54jNh9+wdD6LBn8/NaXtKdpEn7ui/359fI5TwCifLnNLRLiAY+YVKgfnPqcoJFT1SUMisgjVNSrhY4ZQzF79DYzG1ksYzMjd2cT2QvJgV43wmyAtvkE5NQzgQwMXq6eIL6bIEJnFWXDXn9ZV4XtMMSdxMj0d+PyYfhI4c810t8bt750FkUQ/IB7DKew1C3pwrIZYvXPwuZQObhrp95+RGuDlTy6s5c26wsIsFEUgTNR4FiHSyZnbyqmOoMS2pIs8OCLzKTc+bYCpHI8lpv6smm5F3oR28IK6FYzN0UKivzqxti3B2sTOlcOn5u2Qxo+5uwxE9UOk8Lp9pDvXiTTHFLYTR3nXdPslbjr9M5rU5n9NbZ+neqhWVyWOFN5/mwQJYM3ax70yKxQRUXNjQSiwDANPUuk+sM38WE/yPYqbzLcaW0+4RsCKD2WN3T0q3Z+S3uFI0QRZcmhQGd/6dvQbz+oajp60WN6+75CkEnZIm+LeT7ixVZNhXcPyAXHxhP07oURLxvdWgFY0PnzWuJvDdkyZCcfmTsezV6AN68c0aQXnRv9yPYAFN6upgmNOHnXuEoFMDznVbfzsx/M40b4S255jhD/5fq6LBFQHm/IfPYuNVhrsnpdszy1uw0h/B8jbvN1/HUK7aXnoKKzaC0lhFYc1m5yILUsHlzba3G0BDqld9602BU7SqteeZSixsbFkCP+HlD5lZK1jL3ZPq7ZmGjv4qOHsHLKt90/wHsGASmCta+Yfd+5hyHl7ouHf7nXhwHMfkddN0HFC+aBDEyUj8cXTdcUyJ35cYSoUzvGOapq6ZGKdR+Kl3o17j+I89QzZe5T6q4i1YMWWgK9a+A9YVvQsWsVa0nCe4+dgHYZlIGjQBoLIfDJROTE2bmzJuVNUQRUOVwqasTKp0FHQiLTHcI4hDBUwcD6C4Pl4V+ylY2u0ZBpZ4dbH0a2CRiXkZ73D/5wgULI0Xb0w62g4faFM1Ivl+mvor0ytNBn9kVEmJILlGh9pEe9FA9zlWrsf1Hn0JLP+nYLHmd8EiFdOs2hP8fBSNptvD6FFjpLIE03XARwsljTCv+kSJ6V/IiZxcYnBnQY3Q6gLJegRX+OhBZ06K757kb8EKhTdWxq+Dla1K+L7J8ikCsJSSP8SyLi5oMJkkYU4QJ5ibrgtPzp9edl0j0T4NIL9Gc05JJvPywA8CdlX/+FH/EFhkYvaW9vVQLu1AUHjVbIL0SRahOZ6CCQbc3aehdlnW0TqqdAqdOgbHRYhBuLlm3hTg590qrvfoU2ApzwMrY/b9J/I43iOJKaG0cA8+hvXEICUTego6F6O69XY10g6DVVU4IP+D4ktdTQQZMB5SKrrETwj4Pw/WyXV87/TDhLYP69K4RR9eEg7m1hSFdwU22FqaeTBNepW7Zc4YDET82KX4x8DqmZb6ctYP+mvMTodZgn2u9kg7gTucA5++f7bu91uFo8saHo8GxP5AjyIKfwisK9+QdBf99nOwTn72VxcJXBEjI3ni9h3f2XYtV+ADgtulKPHJE/QdUz4/NhRUilyiDa3tlfzsur1lA9tqHweVnwAWuBsWi6rZ7WBe3s/PwVrd8ruxoc8QjQTwmiiKMieIOox6Afu81NfoSBfHM6eAL9PG8RrYEsrBMdVSUDQd5L0smaYkwsjUj8NsTwCLUy5hPuUqgvYBWNTi4fSv5nWiuIE7DYMmC0qrgPundF0nnwT2TteZJalpAr/2WRCgBScPLVpXegWuYgsG9ANWzDPAosE/UdM0+Tr89RFYTMJfhRJ/kYY1Fkp2lUpiYrIJ1GsSm1lmnaNqlNtEon3zTbbyXHUD2QRSzOKrs/6Oe3xDz5BZ4bin0T/L05UrbD4Aq6WBwE8kzL5DnSDXwUJqfyZJMPbbNHSPKR+odEjeNndL7LYS5qNE8SjVaAnMxCaTH0xaUBGTHPtJf8SI+Qis6zMPCPjlyrR7DKz54z7+nGYZwDqSQ1pXVHLblbuk21FUQXom24kEDU56DZTd6OxotC9yxjDZ1dB/gLohR9Iktn6jpt6hZ4B19U6sq7MfgUXZkP9yCHCWhU10IIescwL/2BGu6xf/EBg8WKQ8dG1pk75PrAIMi3ybghYURzUok3ZL+r8m4lRwpZLMTwHrOjvsAbDcK3f0A7A6CtbX/R2cWWAuOVHhBK5okqbul9QMDJhKPQJ0SvcwAQ0xJ5EqjsJYJp5DJhF4cOcfiVRMunx3ceiWVu1/X7phPOsK8AfACq4e+ZA2VL+cTAZgtdaROEEjBb2okRDBOgAbZqR2UDCsYImmT0IYjSbu+bG0AKxC3BBNSv8mumfxcvfzxyCtPppy9ySuyV2N/qkW/Bqi/3rYwZNlL01ImckqzCyexG3Wk71rgGZS9RuwMtI5GSmNJCKu7x1IDmCJEilIluX8IzOLSD9x0cw1rrYSA+sp8Sx4S+ZzLAfi6XKdJcQlMEstTSRVG4y+24sGvA/wg1pzvz4PRE2IBzXLTcfAdgh6PIua1cQei8fAYks20r1VT8Ti2h0J38bgvwLWnkZRjK8viCFYwd9kGwBYvWaM81zWbmlpIFlCKSK+jEFlUVS1EQCDg6WYd8ncTAcy8RLZSP5fROiLh2QWmCl0utyz9dGhF68c3fBtnPgrYKE7Bn7IAz38gNpVwPuKGgWq6LZ21bphoYFm6jREYPXYA1zVBMFUaXaVeGHhgOGqpqXkb4lhAS8/ILPWKBx/b6EFQ2jm1WrcDzPrl2PwZJ3R4hNy7ToQ8PstccigjghWN+3qccj5AV+I2nu2JgiyIPC7ci+iodLwUxx5lXXIEKxGJRKRk8eMUrJnq8r3cIWXTxdCTrSCdYHvkdWddwKQNL9ReMDF+JDAIy5TPg1RzY2Gti+nrhyXhNfialDUZrOpqm7XVdWmKkNeXhqTz8O+Ky3HTzTJ56R058ZuJ7xjPb0hNkvvjakRbjMHw7fi7edgLW+xvSZ6L/MZGa+LoixpDJJHE6NUVf1y8sqxKMyosPTwTbTMM2Y7M+0osPPcyVxRJLpEytRKNwIn37/9Lc3yO3w4SrdcuMbgr8C6s3wPLsbJgWG2wV3VAVobbayn5HCKJwWty3PBK9aySYNxbDEgv4Bp4jiHw3a7PRwcxzQFXJUwu2gM0k6bPL60ZK1PSYZLQPc7+oZStuL5I7AVTKybFfb4LVgsUeJN3lN9co1Zxsxdq9PFZ4r1A737kNBQVMQh5A4cj7sFHJlHbGQZ7M/Gs5Kk3wfBGIxuklj5RqDaExpsddkxVfMgc852ezw8bB7PVMTrb1WnpXLK7fLQCtZlsq0pOLc4qyeA2cl70Vq6Ii0+on4+JhQFsh+4e9e0/HQcCXjIWZaqKIVj6kv1ux3xatqNbqFgYXZNaWfjmGa2Go0pGcVbvf8TGtiy/G2eRgIDcm4Nih/U25rQeZMyN52zY9iM/TFf2u9wQj4rQwtfGG/3eb5R6fq2L9X04WgKhBiGrSS+Iq1IN4uFYNZ7IhXlJXVaUk2twc/2QBRpj5l8qc5src3VYlArcYr5JirNJPZVZs6aCacsZ7R8Wz25xum6jsrfIg7SBNN7+CelZzGwctvO7Twe3CyIeSoGkgXYcAPc4koYQ6plDoXYADjNMX10xW/SLOE3uV3YEy6diQ8mdvsLS+EzuwTx8t3WkDleeKur6NivVWy3ZkIqqhbi7oaSk/Rz0q91yiOWqiSgrOtHyTxg8t8TE/+oJ8BWdwJO0BxVgGE4ksrraH+CNPUkXaxIJ+om2HS4otPyvGo6pgK9dkSloRIYF8gfnFkEs4B4nDayppqmKWmyops/RuXoPLpYun5ytRcEDD+w/C5smo3DOWla0VQJbysZcGNFVwX7iTnLmH2oDEsD8hr3OmFXWttrKwAr6+DF9jBvepJMtueyMI3Nb2rPngcQ0/BDMR2uabCvD8osOrhiMTUdxiIogsyrsndnPNReP0Xr2r+PB9NEp0sycVOaqhqUTFQU7t/HLaBjAPaSamgaS1nmNWgc2s9MVmYul96XojdWaFjWMvzIxiTXdWOrwUQa927ikgAEU4ALrI6z8JM1+mSHDWvwK8eaj1GefC5YlCZ2vQnDsGrz+8YiBeu8Knq1cpn5Kdo2EVJwOrme9YPITXJMhrcLy/0NWyHRgSWdYcHwQVxGIph9lclV/C7wY5hItSmqG1A7GiqesHT7Ui8bcyCezFtgKOoembUNDu0hO+thYhL7p6n1/wRRo7QUC7LRTZ8EDt8RUI/EAS1slzTUD5IDPGBUywsoH9vxLV4iHo/6S9FmMJ1CNNYeSAz5BFGr6uurMc8mkDcq2RwsUsa0JkG5I91hpmDN0NnakcyOeI6B6Vu4Xm47me1oxGtQngRLTWo19NV7VvlXiKo389vtKW4QLGKRbGE2iwveV0p8xyYpYEaCAGQEAWt1Dz3vRDqzUmg5M/svCkkfUsH3QDLbJwh3WOj1U2/5DBqUdW1TY+5tHpIx8HO1IzUu7ox9j2HkPJ9A2MbArTuWTtky6yVi1z6UBv8ZwrWe587Vp9CgrKbfwGZWsUR/Hw4iuDs07NKaIlhBlcqbgCXmb1cyz6l/uV1NW48sCsA/WWZhKPAZ6cXPJn5dm9ofGFiek/WuW4IhP+A+3lkauAnsdfWA8krcgGRverfPBuYLj6y+iPFksMCNdr7hVk/U0dQDyxzGWDNquagBoGyxvonEZkkneiQRBzBPA5Ot8SXUhkZt+ISMzTNZ4rfEii5s89bkko7v0ixLg0oQy0VV+Jz0mmzmwYVqSQFEeo0TudJQGO/aqkf6ouB/iDR9hQJJ1p5rej+JmFthdKPJyRLu1gPPRVAwo8VtwL/ALfcYvtriRnxRFM1kBucU/BRusOy2NHhOKxWev/HjvkqjqJbfs3wScOEiqIYgqtygg/u5cAOH9Ys4QVxwa1/vRoHvp+BH9O5+H+l0W5qqDlyjOo4pDIIKDhlc+wlH+gNKHOm71jxQOd1moaWSmg7ZwvTbuJFjn+4TWJmQ/u7rQsdacwybuab/BJ78QLbyI5TGW/t7Tiuqo9dEjXHBOEnmqTX9E5ePhiYMy/BE8FszgFnNQAlLal5XJVXwmYgu0jMo+bZQgVWFjgpdr3PY3haJLS1nG0G8Z+ck/Bq6DVlos9Wo6cgJnPQd1deTCbMtZf5gHFRd1g8GiCTJwYxSQRPDGAW9IDRxGDcCyHRFiWOR52VOkbairkumo2lggME/yrMm1vcmXJxinkrOpgwzcBYhsfI8say+BxMVkzj73rISPCRSG2GtAdDS1hlIvu/LPU8kW+f4BEda9LgJ26ZZM5EZvnuBamLkarJHhCsHUzSLEu2RfU7/AYoMsKlONlLk6Frvp74rvr+VUaITMZeM7elIUgpvTNIAjQ6sLrWWHjltJ6bVuea5RaI7ghidKqFWK23uE25sf+fU6cpzUVV2Y3wGfRg+9VxhYZpOlU+wrJXr7h8OBaW4fFNtoIPlpooVgccwtwESOwbtBzjGMcisMmYKsQxjWeEwCK6BGh1AQzYL7hj7MRE4w52dWMQG6+HRbGzkZFagi6G4VknJL3VICorqeaf243S6alrvcqm0sNL61P4kVMBixHp81CLyPyNARE5u68N2aq3SMc04aTeO4oqNZWOFl2IqcjfkuzFZB2clnBiZTlftddM81FPROk5RCV/eFvMvoVjAaZGRNslS4hPLzTKyl66cl3QQlivzfJAC4meWC5ekqBUyVKmfWNv5V1MnswqaM1t3KnDYrnGWWWnfoQN4QUuimXs9m0oevciTjW/p+D6fPJkbpsKeGrme7bZrOq+tS3nVhmN4rPKOn/PNoV79GUPoZjvfhbNt2bMQIneGwv8KWDm4xrIkmbJkGqpo6LphiKcUUVuBCeTxHBZzsRpmd8aC5DgHXjQMSXJE2XEcQ+H+d8BiyLCVeFIjT/amh/OIml4dxiAwqExGMKrScUO3QIXMGXJpDH5R3geLLoBmp99+p+l6ftBvJFtnev9A/K72SYOLdb0omxU+2S+3a1WEtVbkIgl07TlMSF8VxKJeeCy8v4+13zkmWzja24eD/fsC60Eimr/z/pQ8nSXrHxLLCEjmMLDAPcxwv6qVrIUdEhc1HnpHNBhTtsTPj2ShAdNK+cmmX186p0U2v3eJGVPH3lD6vifyS1QpDCx1yZx0FOl2z73IqTAbPNwpIJ7SEzkHBl1oK1hSndndyNyiTn5bpPqKMulshIUfV0L6Ctn821T3ZJc8t/CfsW4D0fjQ3G4ZWJGIVUs9FbNE2O6kAfM2Md9hERhYgrk9LIJOwdrJ79RMQboG6/cuBdr8Wyft2SIMOI5l9hg0RBrRFL/IMNM0MRGjU3ESmuRqukEkSRQsnVoSMQWrljnpXWHxBiyLMaxb1+PYdlPedXggtauk21VVmQQe+IgsmJFvNmGQet0cjN6uq7q6WB+yw+ny5hhhYPW7rsiweiW9LRVhgQ13rFE5Feh+hllS0nz16vNQDsoKliyAe7MzNQRrNOceS5jjMqtxmVlwYBw7GisteakuJpvNrFZ+b2PcHbDWT/vMMJ3zQ0RK57TCvTnAIBOy3ybE3kKX7A2F1sUFTfeQE98tt8yxONBo0u2xFSzSHSjjTdSzZ2mM49YixRGelx1qks1kjlAcO5/PCOxOVY6IzE2dtEkqCpZTeNO6t1RkqZwMLC3ZzQ62LjduY9r9cAKL09579luwTJa+74HVZjkRcVm5pCPuOcPWJMKIWgMzecATATRAsByqUG368RZLpbLp5tgZrNqhE6bAdU1XoholcKADpUmY9oIn4EHtF7byYNIeA0sXSALmVFsTXHo1R9yVhGDRdE2USXRjuddLNN8atGEJrDesMusnRRPegJXbbLODPTGwCE0pseCpFCzCwOpC3My+P2OyAkNCB3Pq+oNL3hy7C1bZI0wMrHZYwWLUHX7Bm6XjpGCJDbFNi9QMLKHm1w0NZ7BYPnAn0LcV2iQ0EtKcwXp3RfoaLHibRe6LiNZUrGAVDoycS7FGY5/kAYAFf0sumil00t2AZUEPo4rwFbk9dhesdCFNQ8GChgqGKZ1Nn6ws/Cu5X1jQnTnS5o50fOVvyiAI9hpHzSvUiayuAwxToFmuAsdjlGpoUxns1JBqQZyE79fsNs+nGpio00QCmLekOIGVARtFKGE6NbG6FFRMV5R0+CNv1m/A6p2CdBGZUDBdH7sLlpeQBHctB2ZVVNgGwIJH4Gn5l/Ryo3C6udmPYyIuJDbNLfxfU0WR5/ADDBznbCXAR+DMRhsECcOCmgYu5NaEEwebSPo+GKNG0rn3La3hXKnDqDEeDb0XpTTPV7BI65Ad8gSyoY8yq4jWcrxZDLPsBqwEePRQlrFh3x5bwRIuYAEmaliG+MjAsUeuIisbIs+2h19aEi4FfUo1E79g4ZE1rlDw3Ghd2Y+tetmZlIrJXuR7ZuqBUJZF1XSabNLFdxNDZn59jcEWRmUjqKkmt9YJLNAmbH5eZFZ0nKiRlAEj3oCFW7PxBjF/c+wEFo/ynkowzyNJR2+aUZkVbL2LzIoOj2wl/ZES1RiJ6olgQFheY5pc3OiM6aw97texkn7stDnCArhJ4u5RJUucLDWxrPNLbuucVtkL6Y33lYtvrpqS8iwFi6S8CSPN2R6UkI26wkGPZI9/2Uc3w4N6fgKL1Z8HI4DHV2oBolfHTmDpAMSWGkJcROieNhfcjhEbFsdkBWskbE97+nk/cmNGBCxQRdb6WSp8yyx8QQfeH2jFF6x+bWqCrpqmRneISQiWLPgFvMDEKXLcwDADWD9LEYo0kBWuJYS0SiBT9KmEkGwpNyQstys+9GmwI/0W53G1tYQotTmsxJEjq5VBOk4w6p6+lcwZro6t5PH4NuZjkY4bm4xHelATwXJD/HZ/Jf5hCdLe8g7e3nWT4fOeUAfC1gHjEHTRhMl2KoiJajht/qabCNpKDyc7FPr9GOCuC6kCbSIh/yS5FJGd08B0+Ol+Pqsuy5YCs89zBmsakTG3cjq16BE3t+y57X04iFMisQsPWTWFv134AX95OMUKi15STJZ1OnaiVqTcNdotWO5RQW9DciwjX+Cze7uwcixFTyvNT/Yv7EDU1ZF049EDxk4OKU56sJjkK7DgTe4xVdmjkmcG/ejAhEep6h8ibwn0DRnI3nygYsjvpurtbqlnUyqBzDr02eDw1rjFVD4PbMflCiweBWJ0AssGsDSwKDywGLNt5vFbm5QL2RvfYJVVenI85gfKeQDLPIIxqs3ZEXfXOjWx9QtY6OgAWPt9N+AamxfSj1zsHDUg/pZs+JE0BrCh+L42/FOUc785TuqLuA1N8fkuBUbapqQwrV1MzCuwGlQp0QC2a6MviliS1CHxzgLPKDDJEu4PdsoBWMr9qil/jpKnpR6+R4GEO5SA9aqDUBJQ570Tk3z7Fix0pHLq5ugAlnTMwX4NiN2Awem4GdeQ0VB+Nw98NJI/sHKp4V54Dow0S63JTp2JLclZoN6ClaDMYgoewVIDXzZdEprgH8ZkNNUNlv/5ciWv708lrkebbsOlXE0SgydZZR37zRuwcF3VOs+sTX/Mq8wXwWwI5+kvKxfBkr9bB+RD+nclKm0EcHOkHZm2GI7hVXc0omAQb8HKfKt3dyL8SLDsCph2ozi6Kr0gTl2hAVf6c2BFnqSAn/TXF7cypbkkawu3Fbo/ol46GXybgdfcDGtx29u9JYKr3/g3YJG+iUNOrnd1G5ZkbEhtankPfjSRa7Bq5a7QPr1pwMTtBvOXlxM2Eg1tNc7wB77SPMucTJQ4XAYdY/BuJXBhPIAvcwMWkg2umzuBGnBNbmkEsUEnb9GlpVk6W36kAu4N0Rji15deKok9dyf+AW2MpdxLHHYgUVRKKsaT9g5YBxQwVkhKOofYIhhPl3q8ULj7jaKg3/cJ7hcmexe8sb0Pf5+klLQWuMisfMRzmP4GV8Dtsh5d+FW5BdbqHuFhuBn6OmnPGiOdwCKL5rl7jIb0NBlsvZ5+Aot91QUuwdeT5JZLt/0n+aeXyXAXpLBUcTkI1ELv9M0mLgVpc97OjmD5QerXTpbm+5orTW4TdpVGw8iqspRxtwhvKsmc7350I2vRoeMdn1gtSf4+M4vEvOd0GMeuTdyycdFQmmlM4i9v7OsjPqC0g8DbMg73/7LHvjuCS5cc86R8A1YuNtlfKDez/wPkunHDhoMO4J6FiEJouSv70cWY9dyNQb79ZNYwLfEi2vss5TnXspJONqs82efaDVjJX46k8cRd+FAQczfJK1Pf4TcsOHHMXE/juPtmVk9TKdttQLwFVZ+7Pb9MSYjjRiDTjoXjdhuqGg1al+9AP0+DjhQdTXFk0wTDYcQFtPYH/6RHz2BFhkTYxjZ4JvLKNmHBCXRt6dJTF5GO7YjIqdcG1xw/6UwDu7Ea0jmvabwmLyyJQ70B60KtzGaEP+iiJopMB2IC7t2X1LMS6OKOgkVuwFJTP92R/simzY4Ow0pwIZyBRWYn2jJtaVQXsMjOJPvLbc5gBeobsI4Y3+/RnHbtAZ++G9PjyXJdJ2v5yZqJdHVnmuwZy1MKAtewVFhRfgtWvnWLYhIVnSW4NpyMkfdytm27ld+pPrqC1S3ghndlcQMWyiyQc7ttewErJuh7Ehai6qXWYc03wxVYySHdm1X1lg0jkLnXYLno/TRkBzj3RabBKNqgPyD4GL5fw8pMDj9MmAKi0C8dmyB3ukqXF04R5Ti35SuwXNcHbThOvKbEFa8C2y0yX4eS3O6qMiwrTEq6Jy1XsMDbxJnV/wAW7TAGfBlYQdPbOB4Glmt6bAGWVM01WNsMZ9ZbAW+Z0wWszdL9BU/al8kMHNvbJAW0ZgCL6oeYP0Wkp3PG9UOEHykq/SDw4Z4go7OQuqO5u1ZgZFEH15G2+8mEJ4ViQhLaTyz6EJzi/vF9bXgCa7HvsKF0yqeiPaZgtdY+GuYTG+ZysEaMORaWZrwzDcCGZz1RnbbBNMBRByoUDDqzZpiNVb+P+In0cLnPl22Q0vdC2pA4Nb2o/pxDW/Dnar/F+LAAAANlSURBVGcJvr+cuniFTKvqM7TgoAGS0dYxb0SzCCsaVGHPT8FkYOG7dlZPp7kLYm5ecP7T72QEV2BNmIKAYHXIVhgxLpwTWEZPOtooYgs2GZs4zv76NqXB8OxwnaLEm7iAQwmjGCqCA/J4kiBEvgzTtKW5A20MOgN/yY6fC8Pb+rnwbIKgsY10uXkBi0NRC70tMPsPFwkYN2DRB8KtYNXyfQs+385uUpcwtOqA2t7atklBVYF7MGPPC4uycGmZrhgeY+OL8v/ysmPc91OD6NeHwi0aNo/SY9n3drMn9DYefTm+KqlzMXWHGvFMxc7NMdKPC1++Ttcrg79za8Oawm2Kbd27WMW9OHqutXwyUoEWfH0Bq2cvFTxp9j1Bjla3sBEsXPjlOtBWrIKVjQH7YQVrI9wtqOm7EVijOIxgD7+BlYH7Pemw3BH3eyZ+1lPTcNxH7ghWK25u2btRdN714PfJ6e3Tm6Wn21KsMnqbpD9PkH1CF9f2e/gHzqAVinsW6Hm2OyA6tXaTT+fBdpcEGLTzEiZbi+pUNo6GlXdnsLBeTUPn0IzLWPIKlvmED0T8CwgNhlWRoczy2SqNF1+B5UYxziLLyUHqA1isAESLJsr6BRWsBfmEysXfnrDEpb6CxWMCKNUP0xUbcqLIChrK3QiGK4BFOYAWnzlpQ/kp30v65pTlymWTUiICI8v60vZMwOto0mPGg8oE2TSbNBJzGElac8Iwkmx7csyeW6vgexKWceT0tf5ZIrkB2OL4lyuVtTLliZun1yZusSj6RKU9sWXeDiyppUJypN+5MP9AROmfJI99r7DrkyKPRU5UQdzHA5jnHC7hZyPuOwPNA+q+3nW1nUB7HWyNhVsw+0blOZiISxMqND/p1wLL/xpilbCxVqHG88LJCGUfHOcUXjLopz5EOKvTL9FpJxeIu3zFXQFafzX+01MrFrhnkvAPr4b9Vqr065EKApZ3PP0B80UQZJ3nRRU/n26oIn5sfj2unBsJwjXe/H9Xxo+OpCKL0VqVclmWYRg3+DEuDMPjHt+q9gorCqLe6qNgbxVeXdFG4SDw4H/HMf0eNy10ialJhvTQ5wb+reSPbo/pN7bd/voGoajFTcq55UbP3fnxohe96EUvetGLXvSiF73oRS960Yte9KIXvegx+n+uuQdLYQgFkQAAAABJRU5ErkJggg=="/>
          </div>
          <div class="content">
            <div class="heading">M.A. RUBÉN SOLÍS RÍOS</div>
            <div class="heading">RECTOR DE LA UJED </div>
            <div class="heading">PRESENTE </div>
            <div class="heading">AT’N: M.F. VÍCTOR MANUEL AGUILAR BARRAZA</div>
            <div class="heading">SUBSECRETARIO GENERAL ADMINISTRATIVO</div>
            <div class="paragraph">
              Por este medio, reciba un cordial saludo. Al mismo tiempo, con base en el Acta UJED-FAM-018-2022, el ${formattedDateString} se realizó la entrega de obras “Mantenimiento de Aires Acondicionados en la ${selectedDescription} de la Facultad de Enfermería y Obstetricia” por la Coordinación de Obras de nuestra Máxima Casa de Estudios.
            </div>
            <div class="paragraph justified">
              Por lo anterior expuesto, me permito hacer de su conocimiento que ${description}.
            </div>
            <div class="paragraph">
              Sin más por el momento, me despido, no sin antes reiterarle la seguridad de la atenta y distinguida consideración.
            </div>
          </div>
          <div class="signature">
            <div class="signatureTextCentered">
              <div class="emphasis">ATENTAMENTE</div>
            </div>
            <div class="signatureTextCentered">
              <div class="emphasis">"POR MI RAZA HABLARÁ MI ESPÍRITU"</div>
            </div>
            <div class="signatureTextCentered">Victoria de Durango, Dgo., a ${formattedDateString}</div>
            <div class="signatureTextCentered">M.C.E. MARIA DE LOS ANGELES ALARCON ROSALES</div>
            <div class="signatureTextCentered"><div class="bold">Directora</div></div>
          </div>
        </div>
      </body>
    </html>
  `;

  let generatePdf = async () => {
    const file = await printToFileAsync({
      html: htmlContent,
      base64: false
    });

    await shareAsync(file.uri)
  };

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      style={{backgroundColor: 'white'}}
      keyboardShouldPersistTaps={'always'}
    >
      <View style={{ position: 'relative'}}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={30} color="#ce112d" />
        </TouchableOpacity>
      </View>
      <WebView
        style={{marginTop: 50, flex: 1, height: 300 }}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        scalesPageToFit={true}
        automaticallyAdjustContentInsets={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
      />
       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity onPress={generatePdf} style={{ padding: 10, backgroundColor: 'blue', borderRadius: 5 }}>
        <Text style={{ color: 'white', fontSize: 16 }}>Generar PDF y compartir</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
};


const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    marginTop: 50,
  },
  logo: {
    // position: 'absolute', // Posición absoluta
    top: 0, // Arriba
    left: 0, // Izquierda
    zIndex: 1, // Capa superior
  },
  logoImage: {
    maxWidth: 100, // Reducir tamaño al 50%
    height: 50, // Reducir tamaño al 50%
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
  heading: {
    // fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    marginBottom: 10,
  },
  signature: {
    marginTop: 20,
    alignItems: 'center', // Centrar horizontalmente
  },
  signatureTextCentered: {
    marginTop:20,
    fontSize: 14,
    fontWeight:'bold',
    textAlign: 'center', // Centrar verticalmente
  },
  bold: {
    fontWeight: 'bold',
  },
  emphasis: {
    
    fontWeight: 'bold'
  },
  paragraph: {
    textAlign: 'justify', // Centrar horizontalmente
    marginBottom: 10,
  },
  backIcon: {
    zIndex: 1,
    color: 'white',
    position: 'absolute',
    left: 2,
    margin: 20,
},
};

export default PdfScreen;
