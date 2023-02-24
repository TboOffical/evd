const express = require('express')
const enableWs = require('express-ws')
const { exec } = require("child_process");
const { randomInt } = require('crypto');

const app = express()
enableWs(app)

function randomString(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

app.ws('/cloud', (ws, req) => {
    let alive = false;
    let running = false;
    let id = "";

    var idd = setInterval(() => {
        if (alive == false && running == true){
            exec(`docker kill ${id}`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
                exec(`docker rm ${id}`, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                });
            });
            
            running = false
            clearInterval(idd);
        }
        if(alive == true && running == true){
            alive = false
        }
    }, 10000)

    ws.on('message', msg => {
        let message_c = msg.split(" ")
        let message_type = message_c[0]
        let message_param = message_c[1]
        console.log(message_type)
        if(message_type == "APP"){
            if(message_param == "minecraft"){
                console.log("CMD-Registered: Opening Minecraft")

                id = randomString(15)

                exec(`docker run --name ${id} --gpus 1 --tmpfs /dev/shm:rw -e TZ=UTC -e SIZEW=1920 -e SIZEH=1080 -e REFRESH=60 -e DPI=96 -e CDEPTH=24 -e PASSWD=everything -e WEBRTC_ENCODER=nvh264enc -e BASIC_AUTH_PASSWORD=everything -e PORT_N=1024 -e STRING=${id} -d everything/mc`, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                });

                ws.send("https://"+ id + ".loca.lt/")
                running = true
                alive = true
            }

            if(message_param == "linux"){
                console.log("CMD-Registered: Opening linux")

                id = randomString(15)

                exec(`docker run --name ${id} --gpus 1 --tmpfs /dev/shm:rw -e TZ=UTC -e SIZEW=1920 -e SIZEH=1080 -e REFRESH=60 -e DPI=96 -e CDEPTH=24 -e PASSWD=everything -e WEBRTC_ENCODER=nvh264enc -e BASIC_AUTH_PASSWORD=everything -e PORT_N=1024 -e STRING=${id} -d everything/linux`, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                });

                ws.send("https://"+ id + ".loca.lt/")
                running = true
                alive = true
            }
        }

        if(message_type == "ALIVE"){
            alive = true;
        }
    })

    ws.on('close', () => {
        console.log('WebSocket was closed')
    })
})

app.listen(7000)