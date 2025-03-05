import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';  // Corrigir o caminho para o Firebase

// Exportando a função POST diretamente
export async function POST(req, res) {
    const { userId } = req.body;
  
    try {
      const progressRef = doc(db, 'progresso', userId);
      const progressDoc = await getDoc(progressRef);
  
      if (!progressDoc.exists()) {
        return res.status(404).json({ message: 'Progresso não encontrado' });
      }
  
      const progressData = progressDoc.data();
      const totalPomodoroTime = progressData.TotalStudyTime;
      const historicalData = progressData.historicalData;
      const completedActivities = progressData.completedActivities;
  
      let completedGoals = [];
  
      // Verificando as metas completadas
      const pomodoro60Sessions = historicalData.reduce((acc, data) => acc + data.pomodoro60min, 0);
      if (pomodoro60Sessions >= 3) completedGoals.push('Complete 3 sessões de Pomodoro de 60 minutos');
  
      const pomodoro30Sessions = historicalData.reduce((acc, data) => acc + data.pomodoro30min, 0);
      if (pomodoro30Sessions >= 5) completedGoals.push('Complete 5 sessões de Pomodoro de 30 minutos');
  
      if (totalPomodoroTime >= 100) completedGoals.push('Mais de 100 minutos de Pomodoro');
      if (totalPomodoroTime >= 200) completedGoals.push('Alcance mais de 200 minutos de Pomodoro');
      if (completedActivities >= 5) completedGoals.push('Alcance a marca de 5 atividades concluídas');
  
      if (completedGoals.length > 0) {
        return res.status(200).json({
          success: true,
          message: `Parabéns! Você completou as metas: ${completedGoals.join(', ')}`,
          completedGoals,
        });
      }
  
      return res.status(200).json({ success: false, message: 'Nenhuma meta completada.' });
    } catch (error) {
      console.error('Erro ao validar as metas:', error);
      return res.status(500).json({ message: 'Erro ao validar as metas' });
    }
  }
  