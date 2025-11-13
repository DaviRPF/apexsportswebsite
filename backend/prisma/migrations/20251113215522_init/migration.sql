-- CreateTable
CREATE TABLE "config_escola" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "chave" TEXT NOT NULL,
    "valor" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "esportes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "turmas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "esporte_id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "dia_semana" TEXT NOT NULL,
    "horario" TEXT NOT NULL,
    "vagas_disponiveis" INTEGER NOT NULL DEFAULT 10,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "turmas_esporte_id_fkey" FOREIGN KEY ("esporte_id") REFERENCES "esportes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "leads" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "telefone" TEXT NOT NULL,
    "nome" TEXT,
    "nome_filho" TEXT,
    "para_quem" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "agendamentos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "lead_id" INTEGER NOT NULL,
    "turma_id" INTEGER NOT NULL,
    "data_aula" TEXT NOT NULL,
    "horario" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "agendamentos_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "agendamentos_turma_id_fkey" FOREIGN KEY ("turma_id") REFERENCES "turmas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "conversas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "telefone" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "foto_perfil" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "exercicios" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "modalidade" TEXT NOT NULL,
    "fundamento" TEXT NOT NULL,
    "sub_fundamento" TEXT,
    "criado_por" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "exercicios_criado_por_fkey" FOREIGN KEY ("criado_por") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "exercicios_designados" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exercicio_id" INTEGER NOT NULL,
    "aluno_id" INTEGER NOT NULL,
    "professor_id" INTEGER NOT NULL,
    "tipo_orientacao" TEXT,
    "valor_orientacao" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "exercicios_designados_exercicio_id_fkey" FOREIGN KEY ("exercicio_id") REFERENCES "exercicios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "exercicios_designados_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "exercicios_designados_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "historico_treinos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exercicio_designado_id" INTEGER NOT NULL,
    "aluno_id" INTEGER NOT NULL,
    "tipo_realizado" TEXT NOT NULL,
    "valor_realizado" INTEGER NOT NULL,
    "data_conclusao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "historico_treinos_exercicio_designado_id_fkey" FOREIGN KEY ("exercicio_designado_id") REFERENCES "exercicios_designados" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "historico_treinos_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "usuarios" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "config_escola_chave_key" ON "config_escola"("chave");

-- CreateIndex
CREATE UNIQUE INDEX "leads_telefone_key" ON "leads"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_tipo_idx" ON "usuarios"("tipo");

-- CreateIndex
CREATE INDEX "exercicios_modalidade_idx" ON "exercicios"("modalidade");

-- CreateIndex
CREATE INDEX "exercicios_criado_por_idx" ON "exercicios"("criado_por");

-- CreateIndex
CREATE INDEX "exercicios_designados_aluno_id_idx" ON "exercicios_designados"("aluno_id");

-- CreateIndex
CREATE INDEX "exercicios_designados_professor_id_idx" ON "exercicios_designados"("professor_id");

-- CreateIndex
CREATE INDEX "exercicios_designados_status_idx" ON "exercicios_designados"("status");

-- CreateIndex
CREATE INDEX "historico_treinos_aluno_id_idx" ON "historico_treinos"("aluno_id");

-- CreateIndex
CREATE INDEX "historico_treinos_data_conclusao_idx" ON "historico_treinos"("data_conclusao");
