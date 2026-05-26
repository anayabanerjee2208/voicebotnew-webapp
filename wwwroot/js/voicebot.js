window.voiceBot = {
    client: null,
    conversation: null,
    mediaStream: null,
    mediaRecorder: null,
    dotnetRef: null,

    init: async function (endpoint, dotnetRef) {
        this.dotnetRef = dotnetRef;

        this.client = new window.AgentsSDK.Client({
            endpoint: endpoint
        });

        this.conversation = await this.client.createConversation();
    },

    startMic: async function () {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        this.mediaRecorder = new MediaRecorder(this.mediaStream, {
            mimeType: "audio/webm"
        });

        this.mediaRecorder.ondataavailable = async (event) => {
            if (event.data.size > 0) {
                await this.conversation.sendAudio(event.data);
            }
        };

        this.mediaRecorder.start(250); // send chunks every 250ms
    },

    stopMic: function () {
        if (this.mediaRecorder) {
            this.mediaRecorder.stop();
        }
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(t => t.stop());
        }
    },

    listenForResponses: async function () {
        for await (const event of this.conversation.getResponses()) {
            if (event.type === "transcript") {
                this.dotnetRef.invokeMethodAsync("OnTranscript", event.text);
            }
            if (event.type === "message") {
                this.dotnetRef.invokeMethodAsync("OnBotResponse", event.text);
            }
        }
    }
};
