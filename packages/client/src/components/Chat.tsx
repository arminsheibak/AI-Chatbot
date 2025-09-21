import { FaArrowUp } from "react-icons/fa";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import axios from "axios";

interface FormData {
  prompt: string;
}

const Chat = () => {
  const { register, handleSubmit, reset, formState } = useForm<FormData>();

  const onSubmit = async ({ prompt }: FormData) => {
    reset();
    const { data } = await axios.post("/api/chat", {
      messages: [{ role: "user", content: prompt }],
    });
    console.log(data);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSubmit(onSubmit)();
        }
      }}
      className="flex border-2 rounded-3xl p-4 flex-col gap-2 items-end"
    >
      <textarea
        {...register("prompt", {
          required: true,
          validate: (data) => data.trim().length > 0,
        })}
        maxLength={1000}
        placeholder="Ask anything"
        className="w-full border-0 resize-none focus:outline-0"
      />
      <Button
        disabled={!formState.isValid}
        type="submit"
        className="rounded-full w-9 h-9"
      >
        <FaArrowUp />
      </Button>
    </form>
  );
};

export default Chat;
