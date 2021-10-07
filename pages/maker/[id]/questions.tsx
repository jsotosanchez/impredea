import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { UnorderedList, useDisclosure, useToast } from '@chakra-ui/react';
import { LoadingPage } from '@/components/common';
import { MakeQuestionModal, Layout, QuestionCard } from '@/components/makerPage';
import { useMutation, useQuery } from '@apollo/client';
import { MAKE_QUESTION_TO_MAKER } from '@/graphql/mutations';
import { SessionContext } from '@/context/sessionContext';
import { GET_MAKER_QUESTIONS } from '@/graphql/queries';
import { MAKER_SECTIONS } from '@/utils/constants';

interface ClientType {
  fullname: String;
}
interface Question {
  id: string;
  question: string;
  client: ClientType;
  response: string;
}

export default function Questions(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading, refetch } = useQuery(GET_MAKER_QUESTIONS, { variables: { id } });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [questionText, setQuestionText] = useState('');
  const toast = useToast();
  const context = useContext(SessionContext);
  const { id: currentUserId } = context.getUser();

  const [createQuestion] = useMutation(MAKE_QUESTION_TO_MAKER, {
    onError: () => {
      toast({
        title: 'No se pudo hacer la pregunta',
        description: 'Por favor intenta mas tarde.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
    onCompleted: () => {
      toast({
        title: 'Se realizo tu pregunta con exito',
        description: 'Seras notificado cuando el Maker te responda.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleSubmit = () => {
    const newQuestion = {
      maker_id: id,
      user_id: currentUserId,
      question: questionText,
    };

    createQuestion({
      variables: { ...newQuestion },
    });
    // add react-hook-form and reset
    setQuestionText('');
    onClose();
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (loading)
    return (
      <Layout activeHeader={MAKER_SECTIONS.QUESTIONS}>
        <LoadingPage />
      </Layout>
    );

  return (
    <Layout activeHeader={MAKER_SECTIONS.QUESTIONS} onButtonClick={onOpen}>
      <>
        <MakeQuestionModal
          isOpen={isOpen}
          onClose={onClose}
          questionText={questionText}
          setQuestionText={setQuestionText}
          onSubmit={handleSubmit}
        />
        <UnorderedList>
          {data.questions.map((question: Question) => (
            <QuestionCard
              key={question.id}
              question={question.question}
              client={question.client}
              response={question.response}
            />
          ))}
        </UnorderedList>
      </>
    </Layout>
  );
}
