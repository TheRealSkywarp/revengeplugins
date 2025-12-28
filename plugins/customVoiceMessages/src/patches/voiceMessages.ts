import { findByProps } from "@vendetta/metro";
import { before } from "@vendetta/patcher";
import { storage } from "@vendetta/plugin";

const { showToast } = findByProps("showToast");

export default () => {
    const Uploader = findByProps("uploadFiles");

    if (!Uploader) {
        showToast("ERROR: uploadFiles module not found!");
        return () => {};
    }

    return before("uploadFiles", Uploader, (args) => {
        const files = args[1];

        // debug
        if (files) {
             showToast(`Upload detected: ${files.length} file(s)`);
        }

        if (!storage.sendAsVM || !files) return;

        files.forEach((file: any) => {
            const isAudio = file.item?.mimeType?.startsWith("audio") || 
                            file.item?.filename?.endsWith(".mp3") || 
                            file.item?.filename?.endsWith(".ogg") ||
                            file.item?.filename?.endsWith(".wav");

            if (isAudio) {
                showToast("Audio file detected! Patching...");

                file.item.flags = 8192; 
                file.item.waveform = "AEtWPyUaGA4OEAcA";
                file.item.durationSecs = 60.0;
                file.item.mimeType = "audio/ogg";
            }
        });
    });
};