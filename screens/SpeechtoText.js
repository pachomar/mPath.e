import React from 'react';
import { View, Image, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Voice, {
  SpeechRecognizedEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-community/voice';

const SpeechtoText = ({ navigation }) => {
  const [result, setResult] = React.useState('')
  const [isLoading, setLoading] = React.useState(false)

  const onSpeechStartHandler = (e) => {
    console.log("start handler==>>>", e)
  }

  const onSpeechErrorHandler = (e) => {
    console.log("error handler==>>>", e)
  }

  const onSpeechEndHandler = (e) => {
    console.log('entre b')
    setLoading(false)
    console.log("stop handler", e)
  }

  const onSpeechResultsHandler = (e) => {
    console.log('entre a')
    let text = e.value[0]
    setResult(text)
    console.log("speech result handler", e)
  }

  const startRecording = async () => {
    setLoading(true)
    try {
      await Voice.start('en-US')
    } catch (error) {
      console.log("error raised", error)
    }
  }

  const stopRecording = async () => {
    setLoading(false)
    try {
      await Voice.stop()
    } catch (error) {
      console.log("error raised", error)
    }
  }

  React.useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;
    Voice.onSpeechError = onSpeechErrorHandler;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    }
  }, [])

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.headingText}>Speech Recoginision</Text>
        <View style={styles.textInputStyle}>
          <TextInput
            value={result}
            placeholder="your text"
            style={{ flex: 1 }}
            onChangeText={text => setResult(text)}
          />
          {isLoading ? <ActivityIndicator size="large" color="red" />

            :
            
            <TouchableOpacity
              onPress={startRecording}
            >
              <Image
                source={{ uri: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/microphone.png' }}
                style={{ width: 25, height: 25 }}
              />
            </TouchableOpacity>}
        </View>

        <TouchableOpacity
          style={{
            alignSelf: 'center',
            marginTop: 24,
            backgroundColor: 'red',
            padding: 8,
            borderRadius: 4
          }}
          onPress={stopRecording}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Stop</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24
  },
  headingText: {
    alignSelf: 'center',
    marginVertical: 26,
    fontWeight: 'bold',
    fontSize: 26
  },
  textInputStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 48,
    borderRadius: 20,
    paddingHorizontal: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    shadowOpacity: 0.4
  }
});

export default SpeechtoText;
