import axios from "axios";

async function socketEmitEventHandler(
  event: string,
  data: any,
  socketId?: string,
) {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_SOCKET_URL}/notify`,
      {
        event,
        data,
        socketId,
      },
    );
    console.log(res.data);
  } catch (error) {
    console.log(`Error in socketEmitEventHandler: ${error}`);
  }
}

export default socketEmitEventHandler;
