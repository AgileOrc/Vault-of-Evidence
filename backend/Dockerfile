FROM golang:1.25-alpine AS builder
WORKDIR /app
RUN apk add --no-cache git ca-certificates
COPY go.mod go.sum ./
RUN go mod download && go mod verify
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o voe-server ./cmd/api

FROM alpine:3.19
RUN apk add --no-cache ca-certificates tzdata
RUN addgroup -g 1001 -S voegroup && adduser -u 1001 -S voeuser -G voegroup
WORKDIR /app
COPY --from=builder /app/voe-server .
RUN mkdir -p /app/storage/evidence && chown -R voeuser:voegroup /app/storage
USER voeuser
EXPOSE 8080
ENTRYPOINT ["./voe-server"]
