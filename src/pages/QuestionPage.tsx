import OptionButton from "../components/OptionButton";
import { clsx } from "clsx";
import ContinueButton from "../components/ContinueButton";
import { useOptionPressed } from "../state/optionPressed";
import QuestionPlace from "../components/QuestionPlace";
import { useLifelinePressed } from "../state/lifelinePressed";
import { useQuestionRandom } from "../state/questionRandom";
import { useAnswersLoading } from "../hooks/useAnswerLoading";
import { useRouletteSpin } from "../state/rouletteSpin";
import { useRoundStore } from "../state/roundStore";

const QuestionPage = () => {
  const { option, setOption, setCorrect } = useOptionPressed();
  const { fifthy_fifthy } = useLifelinePressed();
  const [answers, loading, randomFalseAnswer] = useAnswersLoading();
  const { question } = useQuestionRandom();
  const { setRouletteResult } = useRouletteSpin();
  const { setQuestionResult } = useQuestionRandom();

  const {
    currentRound,
    maxRounds,
    currentParticipantIndex,
    maxParticpants,
    changeParticipant,
    incrementRound,
    resetParticipantsIndex,
  } = useRoundStore();

  return (
    <div className="flex h-full w-full flex-col gap-5 px-10">
      <div className="flex h-full w-full flex-col gap-5">
        {/* Pregunta */}
        <div
          className={clsx("w-full rounded-lg bg-fuchsia-700", {
            "h-2/5": !question?.have_image,
            "h-4/5": question?.have_image,
          })}
        >
          <QuestionPlace
            questionText={question != null ? question.question_text : ""}
            image_path={question?.have_image ? "a" : ""}
          />
        </div>

        {/* Respuestas */}
        <div
          className={clsx("w-full gap-4", {
            "flex flex-shrink-0 flex-col": !question?.have_image,
            "grid grid-cols-2": question?.have_image,
          })}
        >
          {!loading &&
            answers.map((value, index) => {
              return (
                <OptionButton
                  key={index}
                  value={value.option_id}
                  optionSelected={option}
                  text={value.option_text}
                  isCorrect={value.is_correct}
                  disabled={option != -1}
                  onClick={() => {
                    setOption(value.option_id);
                    setCorrect(value.is_correct);
                  }}
                  className={clsx("", {
                    hidden:
                      fifthy_fifthy &&
                      answers.filter(
                        (answer) => answer.option_id == randomFalseAnswer
                      )[0].option_id != value.option_id &&
                      !value.is_correct,
                  })}
                />
              );
            })}
        </div>
      </div>
      <div className="mr-20 flex items-center justify-end">
        <ContinueButton
          key={"bttn_continue_question_page"}
          destinyRoute="../"
          end={
            maxRounds == currentRound &&
            currentParticipantIndex == maxParticpants
          }
          disabled={option == -1}
          onClick={() => {
            changeParticipant();
            if (currentParticipantIndex >= maxParticpants) {
              incrementRound();
              resetParticipantsIndex();
            }
            setOption(-1);
            setRouletteResult(-1);
            setQuestionResult(-1, null);
          }}
        />
      </div>
    </div>
  );
};

export default QuestionPage;
