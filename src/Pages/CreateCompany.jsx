import Footer from "@/app-components/Footer";
import Design from "@/app-components/customer-form/Design";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RegistrationContext  } from "@/app-components/utilities/RegistrationContext";

const CreateCompany = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {registrationData, setRegistrationData} = useContext(RegistrationContext);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const basicData  = {
      name,
      email,
      password
    };

    setRegistrationData(basicData );
    
  navigate("/cadastroEmpresa/detalhes");

  //   const [loading, setLoading] = useState(false);
  // const [message, setMessage] = useState("");
  
  // {message && <p>{message}</p>}
  }

  return (
    <div className="relative grid min-h-screen w-full bg-surface md:flex">
      <div className="w-full flex-col items-center h-full hidden md:flex">
        <Design 
          text1={
            "Transforme desafios reais da sua empresa em competições de tecnologia que atraem os melhores talentos. Na DAMPCode, você cria hackathons personalizados, avalia habilidades práticas e conecta-se com desenvolvedores prontos para inovar e solucionar problemas de verdade."
          } text2={
            "Reduza custos de recrutamento, acelere a inovação e fortaleça sua marca empregadora. Nossa plataforma oferece analytics detalhados, engajamento autêntico e um pipeline de talentos qualificados. Grandes empresas já usam a DAMPCode para identificar, testar e contratar devs que realmente fazem a diferença."
          } showCard={false} 
          />
        <div className=" hidden lg:flex flex-col items-center justify-center w-2/3 p-5 gap-5">
          <p className="text-content">Crie uma conta de equipe parceira e tenha acesso a recursos personalizados, e muito mais!</p>
          <a className="w-full lg:w-1/2 h-20 flex items-center justify-center bg-brand-light rounded-full text-xl font-bold text-surface" href="">TRABALHE CONOSCO</a>
        </div>
      </div>
      <section className="flex min-h-screen w-full flex-col items-center justify-center px-5 py-24">
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

            <button type="submit" className="w-full rounded-xl bg-highlight px-8 py-4 text-lg font-bold text-surface shadow-[0_12px_30px_rgba(255,234,0,0.15)] hover:-translate-y-0.5 hover:brightness-110">
              <b>Criar Empresa</b>
            </button>

            <Link to={'/loginUser'} className="text-center font-medium text-brand-light hover:text-highlight">Já tenho conta. Fazer Login.</Link>
          </form>
        </div>
      </section>
      <div className="w-full absolute bottom-0">
        <Footer />
      </div>
    </div>
  );
};

export default CreateCompany;
