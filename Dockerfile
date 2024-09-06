# 构建阶段
FROM node:20-alpine AS build-stage

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 检查 pnpm 是否安装成功
RUN pnpm --version

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 设置 npm 镜像源
RUN pnpm config set registry http://registry.npmmirror.com

# 设置 npm 认证信息
RUN echo "//registry.npmmirror.com/:_authToken=$NPM_TOKEN" >> .npmrc

# 设置 pnpm 认证信息
RUN pnpm config set auth-token $NPM_TOKEN

# 安装依赖
RUN pnpm install

# 删除 .npmrc 文件
RUN rm .npmrc

# 复制所有源代码
COPY . .

# 确保 prisma/schema.prisma 文件存在
COPY prisma/schema.prisma prisma/schema.prisma

# 构建项目
RUN pnpm run build

# 生产阶段
FROM node:20-alpine AS production-stage

WORKDIR /app

# 复制构建后的文件
COPY --from=build-stage /app/dist /app/dist
COPY --from=build-stage /app/package.json /app/package.json
COPY --from=build-stage /app/package-lock.json /app/package-lock.json
COPY --from=build-stage /app/prisma/schema.prisma /app/prisma/schema.prisma

# 设置 npm 镜像源
RUN npm config set registry http://registry.npmmirror.com

# 安装 pnpm
RUN npm install -g pnpm

# 检查 pnpm 是否安装成功
RUN pnpm --version

# 设置 npm 认证信息
RUN echo "//registry.npmmirror.com/:_authToken=$NPM_TOKEN" >> .npmrc

# 设置 pnpm 认证信息
RUN pnpm config set auth-token $NPM_TOKEN

# 安装生产依赖
RUN pnpm install --prod

# 删除 .npmrc 文件
RUN rm .npmrc

# 生成 Prisma 客户端
RUN npx prisma generate

# 暴露端口
EXPOSE 3005

# 启动命令
CMD ["node", "dist/main"]