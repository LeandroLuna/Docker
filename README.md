# Docker

O Docker é uma plataforma de código aberto que permite o desenvolvimento, o empacotamento e a execução de aplicativos em ambientes isolados chamados de "containers". Ele é amplamente utilizado para simplificar o processo de implantação de aplicativos, garantindo que eles se comportem de maneira consistente em diferentes ambientes, como desenvolvimento, teste e produção.

A arquitetura do Docker é composta por vários componentes, cada um desempenhando um papel importante no funcionamento da plataforma. Principais componentes do Docker e suas funções:

1. **Docker Engine**: É o componente central do Docker e responsável por toda a sua funcionalidade. É uma aplicação de linha de comando (CLI) que lida com a criação e execução dos containers. Consiste em três partes principais:

   - **Docker Daemon**: É um serviço em segundo plano que gerencia todos os containers e imagens. Ele ouve comandos do Docker CLI, cria, inicia, para e remove containers, além de gerenciar volumes e redes.

   - **Docker CLI (Command Line Interface)**: É uma interface de linha de comando que permite aos usuários interagir com o Docker Daemon. Os usuários utilizam o CLI para executar comandos que criam, configuram e gerenciam containers e imagens.

   - **Docker API**: É a interface de programação que especifica como os componentes do Docker podem se comunicar entre si.

2. **Imagens (Images)**: Uma imagem Docker é um pacote leve, independente e executável que inclui tudo o que é necessário para executar um aplicativo (código, bibliotecas, dependências, variáveis de ambiente e configurações). As imagens são criadas a partir de um conjunto de instruções definidas em um arquivo chamado Dockerfile. Cada instrução no Dockerfile representa uma camada na imagem final. As imagens são armazenadas em um registro chamado Docker Hub por padrão, mas também podem ser armazenadas em outros registros ou localmente.

3. **Containers**: Um container é uma instância em tempo de execução de uma imagem Docker. Ele representa um ambiente isolado no qual o aplicativo pode ser executado sem interferir em outros processos ou containers no sistema. Os containers são leves, inicializam rapidamente e compartilham o kernel do sistema operacional do host. Eles podem ser criados, iniciados, parados, reiniciados e removidos usando os comandos do Docker CLI.

4. **Docker Compose**: É uma ferramenta que permite definir e gerenciar aplicativos multi-container. Com o Docker Compose, é possível descrever toda a configuração de um aplicativo (serviços, redes, volumes etc.) em um arquivo YAML e, em seguida, iniciar e parar todos os serviços relacionados com um único comando.

5. **Docker Registry**: É um repositório onde as imagens Docker podem ser armazenadas e compartilhadas. O Docker Hub é o registro público mantido pela Docker, mas também existem outros registros privados, como o Amazon ECR (Elastic Container Registry) e o Google Container Registry.

6. **Docker Networking**: O Docker fornece uma variedade de opções de rede para conectar containers entre si e com o host. Os containers podem ser configurados para se comunicarem através de uma rede privada e isolada do host, permitindo que os serviços se comuniquem de forma segura.

No geral, o Docker simplifica o processo de desenvolvimento e implantação de aplicativos, oferecendo portabilidade, isolamento e eficiência. Sua arquitetura baseada em containers permite que os desenvolvedores criem aplicativos com facilidade e os executem consistentemente em diferentes ambientes, além de melhorar a utilização de recursos do sistema.


## Principais comandos do Docker

baixo estão alguns dos principais comandos do Docker que você pode usar para criar, gerenciar e interagir com containers e imagens:

1. **docker run**: Cria e inicia um novo container a partir de uma imagem.
   Exemplo: `docker run nome_da_imagem`

2. **docker ps**: Lista os containers em execução no momento.
   Exemplo: `docker ps`

3. **docker ps -a**: Lista todos os containers, incluindo os que estão parados.
   Exemplo: `docker ps -a`

4. **docker stop**: Para a execução de um ou mais containers em execução.
   Exemplo: `docker stop nome_do_container`

5. **docker start**: Inicia um container que está parado.
   Exemplo: `docker start nome_do_container`

6. **docker restart**: Reinicia um container.
   Exemplo: `docker restart nome_do_container`

7. **docker rm**: Remove um ou mais containers.
   Exemplo: `docker rm nome_do_container`

8. **docker rmi**: Remove uma ou mais imagens.
   Exemplo: `docker rmi nome_da_imagem`

9. **docker images**: Lista as imagens disponíveis no sistema.
   Exemplo: `docker images`

10. **docker pull**: Baixa uma imagem do Docker Hub ou de outro registro.
    Exemplo: `docker pull nome_da_imagem`

11. **docker build**: Constrói uma imagem a partir de um Dockerfile.
    Exemplo: `docker build -t nome_da_imagem .` (o ponto final indica o diretório atual)

12. **docker exec**: Executa um comando em um container em execução.
    Exemplo: `docker exec nome_do_container comando`

13. **docker logs**: Exibe os logs de um container em execução.
    Exemplo: `docker logs nome_do_container`

14. **docker inspect**: Retorna informações detalhadas sobre um container ou imagem.
    Exemplo: `docker inspect nome_do_container` ou `docker inspect nome_da_imagem`


## Otimizando imagens Docker com multi-stage builds

Multi-Stage Builds é uma funcionalidade avançada do Docker que permitem criar imagens otimizadas, reduzindo o tamanho final e melhorando a segurança e o desempenho. Essa técnica é especialmente útil quando você precisa compilar código-fonte ou instalar dependências em um estágio inicial da construção, mas deseja manter apenas os binários e arquivos necessários no estágio final da imagem.

O conceito básico das Multi-Stage Builds é dividir o Dockerfile em múltiplas etapas, cada uma representando um estágio diferente do processo de construção. Cada estágio é definido pela palavra-chave `FROM`, que determina a imagem base utilizada para aquele estágio específico.

Aqui está um exemplo simplificado de um Dockerfile usando Multi-Stage Builds:

```Dockerfile
# Estágio 1: Compilação do código-fonte
FROM node:14 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Imagem final
FROM nginx:latest
COPY --from=builder /app/build /usr/share/nginx/html
```

Explicação do Dockerfile acima:

1. Na primeira etapa, usamos a imagem base `node:14` para compilar o código-fonte. Definimos um novo estágio com o nome `builder` usando a palavra-chave `AS`. Copiamos os arquivos `package.json` e `package-lock.json` para o contêiner e executamos o `npm install` para instalar as dependências. Em seguida, copiamos o restante dos arquivos do aplicativo e executamos o comando `npm run build` para criar a versão otimizada do aplicativo.

2. Na segunda etapa, usamos a imagem base `nginx:latest` para criar a imagem final. Usamos a instrução `COPY --from=builder` para copiar os arquivos compilados da etapa anterior (estágio de construção) para a pasta do servidor web do Nginx.

O resultado é que a imagem final do Nginx contém apenas os arquivos estáticos do aplicativo compilado, sem as dependências de desenvolvimento e o código-fonte original, tornando a imagem menor e mais adequada para a implantação em um servidor de produção.

Para construir a imagem usando esse Dockerfile, basta executar o seguinte comando:

```
docker build -t nome_da_imagem .
```

O Docker irá processar as etapas definidas no Dockerfile, criando a imagem otimizada no estágio final. É importante notar que você pode ter quantos estágios forem necessários para o processo de construção, permitindo criar imagens altamente otimizadas e eficientes.

## Docker Compose

O Docker Compose é uma ferramenta que permite definir e gerenciar aplicativos multi-container. Com ele, é possível descrever toda a configuração de um aplicativo, incluindo serviços, redes, volumes e variáveis de ambiente, em um único arquivo chamado `docker-compose.yml`. Essa abordagem facilita o processo de implantação e execução de aplicativos compostos por vários serviços interdependentes.

O arquivo `docker-compose.yml` é escrito em formato YAML e contém a definição de todos os serviços do aplicativo, bem como suas configurações e dependências. Aqui está um exemplo básico de um arquivo `docker-compose.yml` para um aplicativo web que utiliza um servidor de banco de dados:

```yaml
version: '3.9' # Versão do formato do arquivo do Docker Compose

services:
  web:
    image: nginx:latest
    ports:
      - "80:80" # Mapeamento da porta 80 do host para a porta 80 do contêiner

  db:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: example_password
      MYSQL_DATABASE: example_db
      MYSQL_USER: example_user
      MYSQL_PASSWORD: example_password
```

Neste exemplo, temos dois serviços definidos:

1. O serviço "web" utiliza a imagem do Nginx mais recente (nginx:latest) e mapeia a porta 80 do host para a porta 80 do contêiner, permitindo que o servidor web seja acessado através da porta padrão do HTTP.

2. O serviço "db" utiliza a imagem do MySQL 5.7 e define variáveis de ambiente para configurar o banco de dados, como a senha do root, o nome do banco de dados, o usuário e a senha.

O Docker Compose simplifica bastante o gerenciamento de aplicativos complexos, pois automatiza a criação e a configuração dos contêineres com base nas definições do arquivo `docker-compose.yml`. Além disso, também permite a escalabilidade de serviços e a fácil configuração de redes e volumes para comunicação e armazenamento de dados entre os contêineres. É uma ferramenta essencial para simplificar o desenvolvimento e a implantação de aplicativos em ambientes baseados em Docker.

### Principais comandos do Docker Compose

O Docker Compose oferece uma série de comandos para gerenciar aplicativos definidos em um arquivo `docker-compose.yml`. Abaixo estão os principais comandos do Docker Compose:

1. **docker-compose up**: Inicia os serviços definidos no arquivo `docker-compose.yml`. Se os contêineres já estiverem em execução, este comando os reiniciará. O parâmetro `-d` pode ser adicionado para executar os serviços em segundo plano.
   Exemplo: `docker-compose up -d`

2. **docker-compose down**: Para e remove os serviços definidos no arquivo `docker-compose.yml`. Este comando também remove os volumes associados aos contêineres. O parâmetro `--volumes` pode ser adicionado para remover também os volumes.
   Exemplo: `docker-compose down --volumes`

3. **docker-compose ps**: Lista os serviços em execução, mostrando o status de cada serviço definido no arquivo `docker-compose.yml`.
   Exemplo: `docker-compose ps`

4. **docker-compose logs**: Exibe os logs de todos os serviços em execução. O parâmetro `--follow` pode ser adicionado para exibir os logs em tempo real.
   Exemplo: `docker-compose logs --follow`

5. **docker-compose exec**: Permite executar comandos dentro de um serviço específico. O primeiro argumento é o nome do serviço e o segundo argumento é o comando a ser executado.
   Exemplo: `docker-compose exec nome_do_servico comando`

6. **docker-compose build**: Constrói os serviços definidos no arquivo `docker-compose.yml`. Normalmente, você não precisa executar este comando manualmente, pois o `docker-compose up` já faz a construção automaticamente se as imagens não estiverem disponíveis localmente.

7. **docker-compose restart**: Reinicia os serviços definidos no arquivo `docker-compose.yml` sem reconstruir as imagens.
   Exemplo: `docker-compose restart`

8. **docker-compose stop**: Para os serviços definidos no arquivo `docker-compose.yml` sem removê-los. Os contêineres serão mantidos e podem ser iniciados novamente mais tarde.
   Exemplo: `docker-compose stop`

9. **docker-compose rm**: Remove os contêineres associados aos serviços definidos no arquivo `docker-compose.yml`. O parâmetro `-v` pode ser adicionado para remover também os volumes.
   Exemplo: `docker-compose rm -v`
