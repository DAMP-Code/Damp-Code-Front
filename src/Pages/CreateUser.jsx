import Footer from "@/app-components/Footer";
import Design from "@/app-components/customer-form/Design";
import { useState } from "react";
import { Link } from "react-router-dom";

const CreateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const user = {
      name,
      email,
      password,
      tecnologias: [] // pode mandar vazio por enquanto
    };

    try {
      const response = await fetch(
        "https://localhost:7092/api/Auth/register/participante",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(user)
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao criar usuário");
      }

      const data = await response.json();

      console.log("Usuário criado:", data);

      setMessage("Usuário criado com sucesso!");

      setName("");
      setEmail("");
      setPassword("");

    } catch (error) {
      console.error(error);
      setMessage("Erro ao criar usuário");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative grid min-h-screen w-full bg-surface md:flex">
      <Design text1={"Participe de hackathons criados por empresas, comunidades e especialistas, com rankings, recompensas e reconhecimento profissional. Na DAMPCode, você não só aprende — você resolve problemas reais, compete e interage com outros devs e constrói um portfólio que <b>importa</b>"} text2={"Descubra desafios alinhados às tecnologias mais demandadas do mercado, evolua com feedbacks reais e acompanhe seu progresso através de níveis, XP e conquistas. Seja você iniciante ou avançado, a DAMPCode te coloca no caminho certo para crescer, se destacar e transformar aprendizado em oportunidade."} showCard={true}/>
                
      <section className="flex min-h-screen w-full flex-col items-center justify-center px-5 py-24 md:w-1/2">
        <div className="flex w-full max-w-md flex-col items-center justify-center rounded-3xl border border-white/10 bg-surface-light/60 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:p-10">
          <Link to={"/"} className='mb-5 rounded-lg px-3 py-2 font-medium text-brand-light hover:bg-white/5 hover:text-highlight'>voltar para a home</Link>
          <div className="flex gap-x-4">
            <h2 className="text-4xl text-brand font-extrabold">Pressione</h2>
            <h2 className="text-4xl text-highlight font-extrabold">Start</h2>
          </div>
          <p className="text-brand text-xl font-medium">Preencha seus dados</p>
          <form className="mt-8 flex w-full flex-col items-center justify-center gap-y-6" onSubmit={handleSubmit}>
                       <input
              placeholder="*Nome Completo"
              value={name}
              required
              minLength={8}
              maxLength={150}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-surface px-4 py-3.5 text-lg font-semibold text-content focus:border-highlight"
            />

            <input
              type="email"
              placeholder="*Melhor @Email"
              value={email}
              required
              minLength={8}
              maxLength={150}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-surface px-4 py-3.5 text-lg font-semibold text-content focus:border-highlight"
            />

            <input
              type="password"
              placeholder="*Senha"
              value={password}
              required
              minLength={10}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-surface px-4 py-3.5 text-lg font-semibold text-content focus:border-highlight"

            />

            <button type="submit" disabled={loading} className="w-full rounded-xl bg-highlight px-8 py-4 text-lg font-bold text-surface shadow-[0_12px_30px_rgba(255,234,0,0.15)] hover:-translate-y-0.5 hover:brightness-110">
              <b>{loading ? "Criando..." : "Criar Usuário"}</b>
            </button>

            <Link to={'/loginUser'} className="text-center font-medium text-brand-light hover:text-highlight">Já tenho conta. Fazer Login.</Link>
          </form>

          {message && <p className="mt-5 rounded-xl border border-white/10 bg-surface px-4 py-3 text-center text-content">{message}</p>}
        </div>
      </section>
        <div className="absolute bottom-0 w-full">
          <Footer />
        </div>
    </div>
  );
};

export default CreateUser;
