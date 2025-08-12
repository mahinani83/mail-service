import amqp from "amqplib";
import nodemailer from "nodemailer";
export async function emailConsumer(){
    try{
        const connection = await amqp.connect({
            protocol: 'amqp',
            hostname: process.env.RABITMQ_HOSTNAME,
            port: 5672,
            username: process.env.RABITMQ_USERNAME,
            password:process.env.RABITMQ_PASSWORD,
        })
        const channel = await connection.createChannel() as amqp.Channel;

        const queue = process.env.RABITMQ_QUEUE || 'send-otp';
        await channel.assertQueue(queue, { durable: true });
        channel.consume(queue,async (msg) =>{
            if(msg !== null){
                const {to,subject,body} = JSON.parse(msg.content.toString());
                console.log(`Received email to: ${to}, subject: ${subject}`);
                const transporter = nodemailer.createTransport({
                    host:"smtp.gmail.com",
                    port:465,
                    auth:{
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASSWORD
                    }
                });

                await transporter.sendMail({
                    from : "Chat app",
                    to,
                    subject,
                    text:body,
                })
                channel.ack(msg);
            }

        } )        
    }catch(err){
        console.error("Error in email consumer:", err);
    }
}