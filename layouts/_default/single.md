# {{ .Title }}

{{ if .Params.description }}{{ .Params.description }}

{{ end }}{{ if .Date }}Published: {{ .Date.Format "January 2, 2006" }}

{{ end }}{{ .RawContent }}